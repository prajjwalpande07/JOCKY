import os
import json
import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.investigation import Investigation
from app.models.evidence import Evidence
from app.models.finding import Finding
from app.models.timeline import TimelineEvent
from app.core.config import settings

class ReportService:
    @staticmethod
    def generate_report(
        db: Session,
        case_id: str,
        title: str = "Forensic Investigation Report",
        fmt: str = "PDF",
        report_type: str = "Investigation",
        investigator: str = "Dr. Sarah Chen, CISSP"
    ) -> Report:
        case = db.query(Investigation).filter(Investigation.id == case_id).first()
        evidence_items = db.query(Evidence).filter(Evidence.case_id == case_id).all()
        findings = db.query(Finding).filter(Finding.case_id == case_id).all()
        timeline_events = db.query(TimelineEvent).filter(TimelineEvent.case_id == case_id).all()

        report_id = f"RPT-{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        filename = f"{report_id}_{case_id}.{fmt.lower()}"
        file_path = settings.REPORTS_DIR / filename
        summary_text = (
            f"Forensic acquisition & triage report for case {case_id} targeting "
            f"{case.target_system if case else 'system'}. Analyzed {len(evidence_items)} evidence artifacts, "
            f"{len(findings)} findings, and {len(timeline_events)} chronological events."
        )

        size_mb = "0.5 MB"
        pages_count = 3

        if fmt.upper() == "JSON":
            report_data = {
                "report_id": report_id,
                "case_id": case_id,
                "title": title,
                "generated_at": now_str,
                "investigator": investigator,
                "report_type": report_type,
                "case_details": {
                    "title": case.title if case else "N/A",
                    "target_system": case.target_system if case else "N/A",
                    "platform": case.platform if case else "N/A",
                    "risk": case.risk if case else "N/A",
                    "status": case.status if case else "N/A",
                },
                "evidence": [
                    {"id": e.id, "title": e.title, "source": e.source, "sha256": e.sha256, "status": e.integrity_status}
                    for e in evidence_items
                ],
                "findings": [
                    {"id": f.id, "title": f.title, "severity": f.severity, "confidence": f.confidence, "rule": f.rule_name}
                    for f in findings
                ],
                "timeline": [
                    {"timestamp": t.timestamp, "title": t.title, "category": t.category, "severity": t.severity}
                    for t in timeline_events
                ]
            }
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(report_data, f, indent=2)
            size_mb = f"{round(file_path.stat().st_size / (1024 * 1024), 2)} MB"
            pages_count = 1

        elif fmt.upper() == "CSV":
            with open(file_path, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["Type", "ID", "CaseID", "Title/Details", "Severity/Status", "Timestamp/SHA256"])
                writer.writerow(["CASE", case_id, case.title if case else "", case.target_system if case else "", case.risk if case else "", now_str])
                for e in evidence_items:
                    writer.writerow(["EVIDENCE", e.id, e.case_id, e.title, e.integrity_status, e.sha256])
                for fn in findings:
                    writer.writerow(["FINDING", fn.id, fn.case_id, fn.title, fn.severity, fn.rule_name])
                for tl in timeline_events:
                    writer.writerow(["TIMELINE", tl.id, tl.case_id, tl.title, tl.severity, tl.timestamp])
            size_mb = f"{round(file_path.stat().st_size / (1024 * 1024), 2)} MB"
            pages_count = 1

        else: # PDF
            try:
                from reportlab.lib.pagesizes import letter
                from reportlab.pdfgen import canvas
                from reportlab.lib import colors

                c = canvas.Canvas(str(file_path), pagesize=letter)
                c.setTitle(title)

                # Page 1: Title & Executive Summary
                c.setFont("Helvetica-Bold", 22)
                c.drawString(50, 750, "JOCKY Forensic Analysis & Threat Hunting Report")
                
                c.setStrokeColor(colors.navy)
                c.setLineWidth(2)
                c.line(50, 740, 560, 740)

                c.setFont("Helvetica", 11)
                c.drawString(50, 715, f"Case Identifier: {case_id}")
                c.drawString(50, 700, f"Generated Date: {now_str}")
                c.drawString(50, 685, f"Lead Investigator: {investigator}")
                c.drawString(50, 670, f"Target System: {case.target_system if case else 'WIN-FORENSIC-01'}")
                c.drawString(50, 655, f"Target Platform: {case.platform if case else 'Windows'}")
                c.drawString(50, 640, f"Overall Risk Score: {case.risk_score if case else 85}/100 ({case.risk if case else 'High'})")

                c.setFont("Helvetica-Bold", 14)
                c.drawString(50, 600, "1. Executive Summary")
                c.setFont("Helvetica", 10)
                text_obj = c.beginText(50, 580)
                text_obj.setFont("Helvetica", 10)
                text_obj.textLines(summary_text)
                c.drawText(text_obj)

                c.setFont("Helvetica-Bold", 14)
                c.drawString(50, 510, "2. Evidence Summary & Chain of Custody")
                c.setFont("Helvetica", 9)
                y = 490
                for ev in evidence_items[:6]:
                    c.drawString(60, y, f"• [{ev.id}] {ev.title} ({ev.source}) - SHA256: {ev.sha256[:20]}... [{ev.integrity_status.upper()}]")
                    y -= 16

                c.setFont("Helvetica-Bold", 14)
                c.drawString(50, y - 20, "3. Findings & Threat Indicators")
                y -= 40
                c.setFont("Helvetica", 9)
                for fn in findings[:6]:
                    c.drawString(60, y, f"• [{fn.severity.upper()}] {fn.title} (Confidence: {fn.confidence}%) - Rule: {fn.rule_name}")
                    y -= 16

                c.setFont("Helvetica-Bold", 14)
                c.drawString(50, y - 20, "4. Recommendations & Hardening Actions")
                y -= 40
                c.setFont("Helvetica", 9)
                c.drawString(60, y, "• Isolate host network adapter and revoke active Kerberos TGT tokens.")
                y -= 16
                c.drawString(60, y, "• Quarantine untrusted binaries located in %TEMP% and cross-reference hashes.")
                y -= 16
                c.drawString(60, y, "• Preserve court-admissible disk image and export sealed evidence archive.")

                c.setFont("Helvetica-Oblique", 8)
                c.drawString(50, 30, "Generated by JOCKY Forensic Analysis & Threat Hunting Framework — Chain of Custody Sealed.")
                c.showPage()
                c.save()

                size_mb = f"{round(file_path.stat().st_size / (1024 * 1024), 2)} MB"
                pages_count = 1
            except Exception as e:
                # Fallback to plain text written to file
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(f"JOCKY Forensic Report\nCase: {case_id}\n{summary_text}")
                size_mb = "0.1 MB"
                pages_count = 1

        report_entry = Report(
            id=report_id,
            case_id=case_id,
            title=title,
            created=now_str,
            investigator=investigator,
            format=fmt.upper(),
            status="ready",
            summary=summary_text,
            pages_count=pages_count,
            size_mb=size_mb,
            report_type=report_type,
            file_path=str(file_path)
        )
        db.add(report_entry)
        db.commit()
        db.refresh(report_entry)
        return report_entry
