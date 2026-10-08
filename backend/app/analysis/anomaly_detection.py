import numpy as np
from typing import Dict, Any, List
try:
    from sklearn.ensemble import IsolationForest
except ImportError:
    IsolationForest = None

class AnomalyDetector:
    """Safe prototype behavioral anomaly detector using scikit-learn IsolationForest."""

    def __init__(self):
        # Baseline normal forensic metrics:
        # [process_count, network_sockets, file_activity, event_frequency, avg_cpu_usage]
        self.baseline_matrix = np.array([
            [110, 35, 120, 250, 14.5],
            [95, 28, 98, 210, 12.0],
            [125, 42, 140, 280, 18.2],
            [105, 30, 115, 230, 13.8],
            [130, 45, 150, 310, 20.1],
            [90, 25, 85, 190, 11.2],
            [115, 38, 130, 260, 16.0],
        ])
        if IsolationForest:
            self.model = IsolationForest(n_estimators=50, contamination=0.15, random_state=42)
            self.model.fit(self.baseline_matrix)
        else:
            self.model = None

    def analyze_metrics(
        self,
        process_count: int,
        network_count: int,
        file_count: int,
        event_count: int,
        cpu_usage: float
    ) -> Dict[str, Any]:
        features = np.array([[process_count, network_count, file_count, event_count, cpu_usage]])

        if self.model:
            score_raw = self.model.decision_function(features)[0] # higher = more normal, lower = anomaly
            is_anomaly = self.model.predict(features)[0] == -1
            # Normalize to 0 - 100 anomaly score
            anomaly_score = max(0.0, min(100.0, float((0.2 - score_raw) * 100)))
        else:
            # Fallback statistical deviation heuristic
            means = np.mean(self.baseline_matrix, axis=0)
            stds = np.std(self.baseline_matrix, axis=0) + 1e-6
            z_scores = np.abs((features[0] - means) / stds)
            anomaly_score = min(100.0, float(np.mean(z_scores) * 20))
            is_anomaly = anomaly_score > 60

        if anomaly_score > 75:
            risk_level = "critical"
            explanation = "Severe deviation in host activity metrics; abnormal socket volume and elevated process concurrency detected."
        elif anomaly_score > 50:
            risk_level = "high"
            explanation = "Moderate statistical anomaly observed in resource consumption and event frequency."
        elif anomaly_score > 30:
            risk_level = "medium"
            explanation = "Slight variance from standard forensic baseline profile."
        else:
            risk_level = "low"
            explanation = "Metrics operate well within expected baseline parameters."

        return {
            "anomaly_score": round(anomaly_score, 1),
            "is_anomaly": bool(is_anomaly),
            "risk_level": risk_level,
            "explanation": explanation,
            "disclaimer": "Experimental heuristic anomaly detection for research/forensic triage assistance only."
        }
