"use client";

import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-[16px]"
      style={{ background: "rgba(15,13,45,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[560px] rounded-[16px] overflow-hidden"
        style={{ background: "#FFF", fontFamily: "Poppins, sans-serif", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #35319B, #F59A00)" }} />
        <div className="p-[24px] flex flex-col" style={{ overflow: "hidden", flex: 1 }}>
          <div className="flex items-center justify-between mb-[16px]">
            <h3 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
              Terms &amp; Conditions
            </h3>
            <button type="button" onClick={onClose}
              className="w-[30px] h-[30px] flex items-center justify-center rounded-lg border-none cursor-pointer bg-transparent hover:bg-gray-100"
              style={{ color: "#888" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="text-[13px] leading-[1.7]" style={{ color: "#555", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            <p><strong>1. Acceptance of Terms</strong></p>
            <p>By accessing and using this sleep chronotype assessment, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this service.</p>

            <p><strong>2. Nature of Assessment</strong></p>
            <p>This assessment provides general insights into your sleep-wake preferences based on standardized chronotype questions. It is for informational and educational purposes only and is not a medical diagnosis, treatment plan, or substitute for professional medical advice.</p>

            <p><strong>3. Not a Medical Device</strong></p>
            <p>The chronotype assessment does not diagnose sleep disorders (e.g., insomnia, sleep apnea, narcolepsy) or any other medical condition. If you suspect you have a sleep disorder, consult a qualified healthcare professional.</p>

            <p><strong>4. Privacy &amp; Data Handling</strong></p>
            <p>Your responses and personal information are stored securely and used solely to generate your chronotype report and improve our services. We do not sell your data to third parties. For more details, refer to our Privacy Policy.</p>

            <p><strong>5. Accuracy &amp; Limitations</strong></p>
            <p>While we strive for accuracy, results are based on self-reported answers and may not reflect your actual sleep patterns. Factors such as age, lifestyle, and health conditions can influence your chronotype. The assessment is not a clinical tool.</p>

            <p><strong>6. No Doctor-Patient Relationship</strong></p>
            <p>Use of this assessment does not create a doctor-patient relationship. Always seek the advice of your physician or qualified health provider with any questions regarding a medical condition.</p>

            <p><strong>7. User Responsibility</strong></p>
            <p>You are responsible for the accuracy of the information you provide. You should not make health or lifestyle decisions solely based on the results of this assessment.</p>

            <p><strong>8. Changes to Terms</strong></p>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

            <p style={{ marginTop: "16px", fontSize: "11px", color: "#AAA" }}>
              Last updated: July 2026
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="w-full mt-[16px] py-[10px] rounded-xl border-none cursor-pointer text-white text-[14px] font-semibold"
            style={{ background: "#35319B", fontFamily: "Poppins, sans-serif" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}