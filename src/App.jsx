import { useState, useCallback, useEffect } from "react";

// ── Full NIST 800-53 Rev 5 Control Catalog ───────────────────────────────
const CONTROL_FAMILIES = {
  AC: "Access Control",
  AT: "Awareness and Training",
  AU: "Audit and Accountability",
  CA: "Assessment, Authorization & Monitoring",
  CM: "Configuration Management",
  CP: "Contingency Planning",
  IA: "Identification and Authentication",
  IR: "Incident Response",
  MA: "Maintenance",
  MP: "Media Protection",
  PE: "Physical & Environmental Protection",
  PL: "Planning",
  PM: "Program Management",
  PS: "Personnel Security",
  PT: "PII Processing & Transparency",
  RA: "Risk Assessment",
  SA: "System & Services Acquisition",
  SC: "System & Communications Protection",
  SI: "System & Information Integrity",
  SR: "Supply Chain Risk Management",
};

const ALL_CONTROLS = [
  // AC - Access Control
  { id: "AC-1",  family: "AC", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "AC-2",  family: "AC", title: "Account Management", baseline: ["Low","Moderate","High"] },
  { id: "AC-3",  family: "AC", title: "Access Enforcement", baseline: ["Low","Moderate","High"] },
  { id: "AC-4",  family: "AC", title: "Information Flow Enforcement", baseline: ["Moderate","High"] },
  { id: "AC-5",  family: "AC", title: "Separation of Duties", baseline: ["Moderate","High"] },
  { id: "AC-6",  family: "AC", title: "Least Privilege", baseline: ["Moderate","High"] },
  { id: "AC-7",  family: "AC", title: "Unsuccessful Logon Attempts", baseline: ["Low","Moderate","High"] },
  { id: "AC-8",  family: "AC", title: "System Use Notification", baseline: ["Low","Moderate","High"] },
  { id: "AC-11", family: "AC", title: "Device Lock", baseline: ["Moderate","High"] },
  { id: "AC-12", family: "AC", title: "Session Termination", baseline: ["Moderate","High"] },
  { id: "AC-14", family: "AC", title: "Permitted Actions Without Identification", baseline: ["Low","Moderate","High"] },
  { id: "AC-17", family: "AC", title: "Remote Access", baseline: ["Low","Moderate","High"] },
  { id: "AC-18", family: "AC", title: "Wireless Access", baseline: ["Low","Moderate","High"] },
  { id: "AC-19", family: "AC", title: "Access Control for Mobile Devices", baseline: ["Low","Moderate","High"] },
  { id: "AC-20", family: "AC", title: "Use of External Systems", baseline: ["Low","Moderate","High"] },
  { id: "AC-21", family: "AC", title: "Information Sharing", baseline: ["Moderate","High"] },
  { id: "AC-22", family: "AC", title: "Publicly Accessible Content", baseline: ["Low","Moderate","High"] },
  // AT - Awareness & Training
  { id: "AT-1",  family: "AT", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "AT-2",  family: "AT", title: "Literacy Training and Awareness", baseline: ["Low","Moderate","High"] },
  { id: "AT-3",  family: "AT", title: "Role-Based Training", baseline: ["Low","Moderate","High"] },
  { id: "AT-4",  family: "AT", title: "Training Records", baseline: ["Low","Moderate","High"] },
  // AU - Audit & Accountability
  { id: "AU-1",  family: "AU", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "AU-2",  family: "AU", title: "Event Logging", baseline: ["Low","Moderate","High"] },
  { id: "AU-3",  family: "AU", title: "Content of Audit Records", baseline: ["Low","Moderate","High"] },
  { id: "AU-4",  family: "AU", title: "Audit Log Storage Capacity", baseline: ["Low","Moderate","High"] },
  { id: "AU-5",  family: "AU", title: "Response to Audit Logging Process Failures", baseline: ["Low","Moderate","High"] },
  { id: "AU-6",  family: "AU", title: "Audit Record Review, Analysis, and Reporting", baseline: ["Low","Moderate","High"] },
  { id: "AU-7",  family: "AU", title: "Audit Record Reduction and Report Generation", baseline: ["Moderate","High"] },
  { id: "AU-8",  family: "AU", title: "Time Stamps", baseline: ["Low","Moderate","High"] },
  { id: "AU-9",  family: "AU", title: "Protection of Audit Information", baseline: ["Low","Moderate","High"] },
  { id: "AU-10", family: "AU", title: "Non-Repudiation", baseline: ["High"] },
  { id: "AU-11", family: "AU", title: "Audit Record Retention", baseline: ["Low","Moderate","High"] },
  { id: "AU-12", family: "AU", title: "Audit Record Generation", baseline: ["Low","Moderate","High"] },
  // CA - Assessment, Authorization & Monitoring
  { id: "CA-1",  family: "CA", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "CA-2",  family: "CA", title: "Control Assessments", baseline: ["Low","Moderate","High"] },
  { id: "CA-3",  family: "CA", title: "Information Exchange", baseline: ["Low","Moderate","High"] },
  { id: "CA-5",  family: "CA", title: "Plan of Action and Milestones", baseline: ["Low","Moderate","High"] },
  { id: "CA-6",  family: "CA", title: "Authorization", baseline: ["Low","Moderate","High"] },
  { id: "CA-7",  family: "CA", title: "Continuous Monitoring", baseline: ["Low","Moderate","High"] },
  { id: "CA-8",  family: "CA", title: "Penetration Testing", baseline: ["High"] },
  { id: "CA-9",  family: "CA", title: "Internal System Connections", baseline: ["Low","Moderate","High"] },
  // CM - Configuration Management
  { id: "CM-1",  family: "CM", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "CM-2",  family: "CM", title: "Baseline Configuration", baseline: ["Low","Moderate","High"] },
  { id: "CM-3",  family: "CM", title: "Configuration Change Control", baseline: ["Moderate","High"] },
  { id: "CM-4",  family: "CM", title: "Impact Analyses", baseline: ["Moderate","High"] },
  { id: "CM-5",  family: "CM", title: "Access Restrictions for Change", baseline: ["Moderate","High"] },
  { id: "CM-6",  family: "CM", title: "Configuration Settings", baseline: ["Low","Moderate","High"] },
  { id: "CM-7",  family: "CM", title: "Least Functionality", baseline: ["Low","Moderate","High"] },
  { id: "CM-8",  family: "CM", title: "System Component Inventory", baseline: ["Low","Moderate","High"] },
  { id: "CM-9",  family: "CM", title: "Configuration Management Plan", baseline: ["Moderate","High"] },
  { id: "CM-10", family: "CM", title: "Software Usage Restrictions", baseline: ["Low","Moderate","High"] },
  { id: "CM-11", family: "CM", title: "User-Installed Software", baseline: ["Low","Moderate","High"] },
  // CP - Contingency Planning
  { id: "CP-1",  family: "CP", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "CP-2",  family: "CP", title: "Contingency Plan", baseline: ["Low","Moderate","High"] },
  { id: "CP-3",  family: "CP", title: "Contingency Training", baseline: ["Low","Moderate","High"] },
  { id: "CP-4",  family: "CP", title: "Contingency Plan Testing", baseline: ["Low","Moderate","High"] },
  { id: "CP-6",  family: "CP", title: "Alternate Storage Site", baseline: ["Moderate","High"] },
  { id: "CP-7",  family: "CP", title: "Alternate Processing Site", baseline: ["Moderate","High"] },
  { id: "CP-8",  family: "CP", title: "Telecommunications Services", baseline: ["Moderate","High"] },
  { id: "CP-9",  family: "CP", title: "System Backup", baseline: ["Low","Moderate","High"] },
  { id: "CP-10", family: "CP", title: "System Recovery and Reconstitution", baseline: ["Low","Moderate","High"] },
  // IA - Identification & Authentication
  { id: "IA-1",  family: "IA", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "IA-2",  family: "IA", title: "Identification and Authentication (Organizational Users)", baseline: ["Low","Moderate","High"] },
  { id: "IA-3",  family: "IA", title: "Device Identification and Authentication", baseline: ["Moderate","High"] },
  { id: "IA-4",  family: "IA", title: "Identifier Management", baseline: ["Low","Moderate","High"] },
  { id: "IA-5",  family: "IA", title: "Authenticator Management", baseline: ["Low","Moderate","High"] },
  { id: "IA-6",  family: "IA", title: "Authentication Feedback", baseline: ["Low","Moderate","High"] },
  { id: "IA-7",  family: "IA", title: "Cryptographic Module Authentication", baseline: ["Low","Moderate","High"] },
  { id: "IA-8",  family: "IA", title: "Identification and Authentication (Non-Org Users)", baseline: ["Low","Moderate","High"] },
  { id: "IA-11", family: "IA", title: "Re-Authentication", baseline: ["Moderate","High"] },
  { id: "IA-12", family: "IA", title: "Identity Proofing", baseline: ["Moderate","High"] },
  // IR - Incident Response
  { id: "IR-1",  family: "IR", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "IR-2",  family: "IR", title: "Incident Response Training", baseline: ["Low","Moderate","High"] },
  { id: "IR-3",  family: "IR", title: "Incident Response Testing", baseline: ["Moderate","High"] },
  { id: "IR-4",  family: "IR", title: "Incident Handling", baseline: ["Low","Moderate","High"] },
  { id: "IR-5",  family: "IR", title: "Incident Monitoring", baseline: ["Low","Moderate","High"] },
  { id: "IR-6",  family: "IR", title: "Incident Reporting", baseline: ["Low","Moderate","High"] },
  { id: "IR-7",  family: "IR", title: "Incident Response Assistance", baseline: ["Low","Moderate","High"] },
  { id: "IR-8",  family: "IR", title: "Incident Response Plan", baseline: ["Low","Moderate","High"] },
  // MA - Maintenance
  { id: "MA-1",  family: "MA", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "MA-2",  family: "MA", title: "Controlled Maintenance", baseline: ["Low","Moderate","High"] },
  { id: "MA-3",  family: "MA", title: "Maintenance Tools", baseline: ["Moderate","High"] },
  { id: "MA-4",  family: "MA", title: "Nonlocal Maintenance", baseline: ["Low","Moderate","High"] },
  { id: "MA-5",  family: "MA", title: "Maintenance Personnel", baseline: ["Low","Moderate","High"] },
  { id: "MA-6",  family: "MA", title: "Timely Maintenance", baseline: ["Moderate","High"] },
  // MP - Media Protection
  { id: "MP-1",  family: "MP", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "MP-2",  family: "MP", title: "Media Access", baseline: ["Low","Moderate","High"] },
  { id: "MP-3",  family: "MP", title: "Media Marking", baseline: ["Moderate","High"] },
  { id: "MP-4",  family: "MP", title: "Media Storage", baseline: ["Moderate","High"] },
  { id: "MP-5",  family: "MP", title: "Media Transport", baseline: ["Moderate","High"] },
  { id: "MP-6",  family: "MP", title: "Media Sanitization", baseline: ["Low","Moderate","High"] },
  { id: "MP-7",  family: "MP", title: "Media Use", baseline: ["Low","Moderate","High"] },
  // PE - Physical & Environmental
  { id: "PE-1",  family: "PE", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "PE-2",  family: "PE", title: "Physical Access Authorizations", baseline: ["Low","Moderate","High"] },
  { id: "PE-3",  family: "PE", title: "Physical Access Control", baseline: ["Low","Moderate","High"] },
  { id: "PE-4",  family: "PE", title: "Access Control for Transmission", baseline: ["Moderate","High"] },
  { id: "PE-5",  family: "PE", title: "Access Control for Output Devices", baseline: ["Moderate","High"] },
  { id: "PE-6",  family: "PE", title: "Monitoring Physical Access", baseline: ["Low","Moderate","High"] },
  { id: "PE-8",  family: "PE", title: "Visitor Access Records", baseline: ["Low","Moderate","High"] },
  { id: "PE-9",  family: "PE", title: "Power Equipment and Cabling", baseline: ["High"] },
  { id: "PE-10", family: "PE", title: "Emergency Shutoff", baseline: ["High"] },
  { id: "PE-11", family: "PE", title: "Emergency Power", baseline: ["Moderate","High"] },
  { id: "PE-12", family: "PE", title: "Emergency Lighting", baseline: ["Low","Moderate","High"] },
  { id: "PE-13", family: "PE", title: "Fire Protection", baseline: ["Low","Moderate","High"] },
  { id: "PE-14", family: "PE", title: "Environmental Controls", baseline: ["Low","Moderate","High"] },
  { id: "PE-15", family: "PE", title: "Water Damage Protection", baseline: ["Low","Moderate","High"] },
  { id: "PE-16", family: "PE", title: "Delivery and Removal", baseline: ["Low","Moderate","High"] },
  { id: "PE-17", family: "PE", title: "Alternate Work Site", baseline: ["Moderate","High"] },
  // PL - Planning
  { id: "PL-1",  family: "PL", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "PL-2",  family: "PL", title: "System Security and Privacy Plans", baseline: ["Low","Moderate","High"] },
  { id: "PL-4",  family: "PL", title: "Rules of Behavior", baseline: ["Low","Moderate","High"] },
  { id: "PL-8",  family: "PL", title: "Security and Privacy Architectures", baseline: ["Moderate","High"] },
  { id: "PL-10", family: "PL", title: "Baseline Selection", baseline: ["Low","Moderate","High"] },
  { id: "PL-11", family: "PL", title: "Baseline Tailoring", baseline: ["Low","Moderate","High"] },
  // PS - Personnel Security
  { id: "PS-1",  family: "PS", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "PS-2",  family: "PS", title: "Position Risk Designation", baseline: ["Low","Moderate","High"] },
  { id: "PS-3",  family: "PS", title: "Personnel Screening", baseline: ["Low","Moderate","High"] },
  { id: "PS-4",  family: "PS", title: "Personnel Termination", baseline: ["Low","Moderate","High"] },
  { id: "PS-5",  family: "PS", title: "Personnel Transfer", baseline: ["Low","Moderate","High"] },
  { id: "PS-6",  family: "PS", title: "Access Agreements", baseline: ["Low","Moderate","High"] },
  { id: "PS-7",  family: "PS", title: "External Personnel Security", baseline: ["Low","Moderate","High"] },
  { id: "PS-8",  family: "PS", title: "Personnel Sanctions", baseline: ["Low","Moderate","High"] },
  { id: "PS-9",  family: "PS", title: "Position Descriptions", baseline: ["Low","Moderate","High"] },
  // RA - Risk Assessment
  { id: "RA-1",  family: "RA", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "RA-2",  family: "RA", title: "Security Categorization", baseline: ["Low","Moderate","High"] },
  { id: "RA-3",  family: "RA", title: "Risk Assessment", baseline: ["Low","Moderate","High"] },
  { id: "RA-5",  family: "RA", title: "Vulnerability Monitoring and Scanning", baseline: ["Low","Moderate","High"] },
  { id: "RA-7",  family: "RA", title: "Risk Response", baseline: ["Low","Moderate","High"] },
  { id: "RA-9",  family: "RA", title: "Criticality Analysis", baseline: ["High"] },
  // SA - System & Services Acquisition
  { id: "SA-1",  family: "SA", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "SA-2",  family: "SA", title: "Allocation of Resources", baseline: ["Low","Moderate","High"] },
  { id: "SA-3",  family: "SA", title: "System Development Life Cycle", baseline: ["Low","Moderate","High"] },
  { id: "SA-4",  family: "SA", title: "Acquisition Process", baseline: ["Low","Moderate","High"] },
  { id: "SA-5",  family: "SA", title: "System Documentation", baseline: ["Low","Moderate","High"] },
  { id: "SA-8",  family: "SA", title: "Security and Privacy Engineering Principles", baseline: ["Moderate","High"] },
  { id: "SA-9",  family: "SA", title: "External System Services", baseline: ["Low","Moderate","High"] },
  { id: "SA-10", family: "SA", title: "Developer Configuration Management", baseline: ["High"] },
  { id: "SA-11", family: "SA", title: "Developer Testing and Evaluation", baseline: ["High"] },
  // SC - System & Communications Protection
  { id: "SC-1",  family: "SC", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "SC-2",  family: "SC", title: "Separation of System and User Functionality", baseline: ["Moderate","High"] },
  { id: "SC-3",  family: "SC", title: "Security Function Isolation", baseline: ["High"] },
  { id: "SC-4",  family: "SC", title: "Information in Shared System Resources", baseline: ["Moderate","High"] },
  { id: "SC-5",  family: "SC", title: "Denial-of-Service Protection", baseline: ["Low","Moderate","High"] },
  { id: "SC-7",  family: "SC", title: "Boundary Protection", baseline: ["Low","Moderate","High"] },
  { id: "SC-8",  family: "SC", title: "Transmission Confidentiality and Integrity", baseline: ["Moderate","High"] },
  { id: "SC-10", family: "SC", title: "Network Disconnect", baseline: ["Moderate","High"] },
  { id: "SC-12", family: "SC", title: "Cryptographic Key Establishment and Management", baseline: ["Low","Moderate","High"] },
  { id: "SC-13", family: "SC", title: "Cryptographic Protection", baseline: ["Low","Moderate","High"] },
  { id: "SC-15", family: "SC", title: "Collaborative Computing Devices and Applications", baseline: ["Moderate","High"] },
  { id: "SC-17", family: "SC", title: "Public Key Infrastructure Certificates", baseline: ["Moderate","High"] },
  { id: "SC-18", family: "SC", title: "Mobile Code", baseline: ["Moderate","High"] },
  { id: "SC-19", family: "SC", title: "Voice over IP", baseline: ["Moderate","High"] },
  { id: "SC-20", family: "SC", title: "Secure Name/Address Resolution Service (Auth Source)", baseline: ["Low","Moderate","High"] },
  { id: "SC-21", family: "SC", title: "Secure Name/Address Resolution Service (Rec Resolver)", baseline: ["Low","Moderate","High"] },
  { id: "SC-22", family: "SC", title: "Architecture and Provisioning for Name/Addr Resolution", baseline: ["Low","Moderate","High"] },
  { id: "SC-23", family: "SC", title: "Session Authenticity", baseline: ["Moderate","High"] },
  { id: "SC-28", family: "SC", title: "Protection of Information at Rest", baseline: ["Moderate","High"] },
  { id: "SC-39", family: "SC", title: "Process Isolation", baseline: ["Low","Moderate","High"] },
  // SI - System & Information Integrity
  { id: "SI-1",  family: "SI", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "SI-2",  family: "SI", title: "Flaw Remediation", baseline: ["Low","Moderate","High"] },
  { id: "SI-3",  family: "SI", title: "Malicious Code Protection", baseline: ["Low","Moderate","High"] },
  { id: "SI-4",  family: "SI", title: "System Monitoring", baseline: ["Low","Moderate","High"] },
  { id: "SI-5",  family: "SI", title: "Security Alerts, Advisories, and Directives", baseline: ["Low","Moderate","High"] },
  { id: "SI-6",  family: "SI", title: "Security and Privacy Function Verification", baseline: ["High"] },
  { id: "SI-7",  family: "SI", title: "Software, Firmware, and Information Integrity", baseline: ["Moderate","High"] },
  { id: "SI-8",  family: "SI", title: "Spam Protection", baseline: ["Moderate","High"] },
  { id: "SI-10", family: "SI", title: "Information Input Validation", baseline: ["Moderate","High"] },
  { id: "SI-11", family: "SI", title: "Error Handling", baseline: ["Moderate","High"] },
  { id: "SI-12", family: "SI", title: "Information Management and Retention", baseline: ["Low","Moderate","High"] },
  { id: "SI-16", family: "SI", title: "Memory Protection", baseline: ["Moderate","High"] },
  // SR - Supply Chain Risk Management
  { id: "SR-1",  family: "SR", title: "Policy and Procedures", baseline: ["Low","Moderate","High"] },
  { id: "SR-2",  family: "SR", title: "Supply Chain Risk Management Plan", baseline: ["Low","Moderate","High"] },
  { id: "SR-3",  family: "SR", title: "Supply Chain Controls and Processes", baseline: ["Low","Moderate","High"] },
  { id: "SR-5",  family: "SR", title: "Acquisition Strategies, Tools, and Methods", baseline: ["Low","Moderate","High"] },
  { id: "SR-6",  family: "SR", title: "Supplier Assessments and Reviews", baseline: ["Moderate","High"] },
  { id: "SR-8",  family: "SR", title: "Notification Agreements", baseline: ["Moderate","High"] },
  { id: "SR-10", family: "SR", title: "Inspection of Systems or Components", baseline: ["High"] },
  { id: "SR-11", family: "SR", title: "Component Authenticity", baseline: ["Moderate","High"] },
];

// ── CCI (Control Correlation Identifier) Mapping ─────────────────────────
// Each entry: { cci, definition } mapped per control ID
const CCI_MAP = {
  "AC-1":  [
    { cci: "CCI-000001", definition: "The organization develops an access control policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance." },
    { cci: "CCI-000002", definition: "The organization disseminates the access control policy to organization-defined personnel or roles." },
    { cci: "CCI-000003", definition: "The organization reviews and updates the access control policy in accordance with organization-defined frequency." },
    { cci: "CCI-000004", definition: "The organization develops procedures to facilitate the implementation of the access control policy and associated access controls." },
  ],
  "AC-2":  [
    { cci: "CCI-000015", definition: "The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts." },
    { cci: "CCI-000016", definition: "The organization assigns account managers for information system accounts." },
    { cci: "CCI-000017", definition: "The organization establishes conditions for group and role membership." },
    { cci: "CCI-000018", definition: "The organization requires appropriate approvals for requests to establish information system accounts." },
    { cci: "CCI-000019", definition: "The organization creates, enables, modifies, disables, and removes information system accounts in accordance with organization-defined procedures or conditions." },
    { cci: "CCI-000020", definition: "The organization monitors the use of information system accounts." },
    { cci: "CCI-000021", definition: "The organization notifies account managers when accounts are no longer required, users are terminated or transferred, or individual's information system usage or need-to-know changes." },
    { cci: "CCI-000022", definition: "The organization authorizes access to the information system based on a valid access authorization." },
  ],
  "AC-3":  [
    { cci: "CCI-000213", definition: "The information system enforces approved authorizations for logical access to information and system resources in accordance with applicable access control policies." },
  ],
  "AC-4":  [
    { cci: "CCI-001414", definition: "The information system enforces approved authorizations for controlling the flow of information within the system and between interconnected systems based on organization-defined information flow control policies." },
    { cci: "CCI-001415", definition: "The organization defines the information flow control policies for controlling the flow of information within the system and between interconnected systems." },
  ],
  "AC-5":  [
    { cci: "CCI-001084", definition: "The organization separates duties of individuals as necessary to prevent malevolent activity without collusion." },
    { cci: "CCI-001085", definition: "The organization documents the separation of duties of individuals." },
    { cci: "CCI-001086", definition: "The information system implements separation of duties through assigned access authorizations." },
  ],
  "AC-6":  [
    { cci: "CCI-000225", definition: "The organization employs the concept of least privilege, allowing only authorized accesses for users (or processes acting on behalf of users) which are necessary to accomplish assigned tasks." },
    { cci: "CCI-002234", definition: "The organization authorizes access to security functions and security-relevant information only to organization-defined personnel or roles." },
  ],
  "AC-7":  [
    { cci: "CCI-000044", definition: "The information system enforces a limit of organization-defined number of consecutive invalid logon attempts by a user during an organization-defined time period." },
    { cci: "CCI-000045", definition: "The information system automatically locks the account/node for an organization-defined time period, locks the account/node until released by an administrator, or delays the next login prompt per organization-defined delay algorithm when the maximum number of unsuccessful attempts is exceeded." },
  ],
  "AC-8":  [
    { cci: "CCI-000048", definition: "The information system displays an approved, organization-defined system use notification message or banner before granting access to the system." },
    { cci: "CCI-000049", definition: "The information system retains the notification message or banner on the screen until users acknowledge the usage conditions and take explicit actions to log on to or further access the information system." },
    { cci: "CCI-001384", definition: "The information system, for publicly accessible systems, displays system use information organization-defined conditions before granting further access." },
  ],
  "AC-11": [
    { cci: "CCI-000056", definition: "The information system prevents further access to the system by initiating a session lock after an organization-defined time period of inactivity." },
    { cci: "CCI-000057", definition: "The information system retains the session lock until the user reestablishes access using established identification and authentication procedures." },
  ],
  "AC-12": [
    { cci: "CCI-002361", definition: "The information system automatically terminates a user session after organization-defined conditions or trigger events requiring session disconnect." },
  ],
  "AC-14": [
    { cci: "CCI-000060", definition: "The organization identifies and documents the organization-defined user actions that can be performed on the information system without identification or authentication consistent with organizational missions and business functions." },
  ],
  "AC-17": [
    { cci: "CCI-000063", definition: "The organization establishes usage restrictions and implementation guidance for each type of remote access allowed." },
    { cci: "CCI-000064", definition: "The organization authorizes remote access to the information system prior to allowing such connections." },
    { cci: "CCI-000065", definition: "The organization monitors for unauthorized remote access to the information system." },
    { cci: "CCI-000068", definition: "The information system implements cryptographic mechanisms to protect the confidentiality of remote access sessions." },
  ],
  "AC-18": [
    { cci: "CCI-001452", definition: "The organization establishes usage restrictions and implementation guidance for wireless access." },
    { cci: "CCI-001453", definition: "The organization authorizes wireless access to the information system prior to allowing such connections." },
    { cci: "CCI-001454", definition: "The organization monitors for unauthorized wireless access to the information system." },
    { cci: "CCI-001455", definition: "The information system protects wireless access to the system using authentication and encryption." },
  ],
  "AC-19": [
    { cci: "CCI-001456", definition: "The organization establishes usage restrictions and implementation guidance for organization-controlled mobile devices." },
    { cci: "CCI-001457", definition: "The organization authorizes the connection of mobile devices to organizational information systems." },
  ],
  "AC-20": [
    { cci: "CCI-001483", definition: "The organization establishes terms and conditions, consistent with any trust relationships established with other organizations owning, operating, and/or maintaining external information systems." },
    { cci: "CCI-001484", definition: "The organization permits authorized individuals to use an external information system to access the information system or to process, store, or transmit organization-controlled information only when the organization verifies the implementation of required security controls." },
  ],
  "AC-22": [
    { cci: "CCI-001488", definition: "The organization designates individuals authorized to post information onto a publicly accessible information system." },
    { cci: "CCI-001489", definition: "The organization trains authorized individuals to ensure that publicly accessible information does not contain nonpublic information." },
    { cci: "CCI-001490", definition: "The organization reviews the proposed content of information prior to posting onto the publicly accessible information system to ensure nonpublic information is not included." },
  ],
  "AT-1":  [
    { cci: "CCI-000077", definition: "The organization develops a security awareness and training policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000078", definition: "The organization disseminates the security awareness and training policy to organization-defined personnel or roles." },
    { cci: "CCI-000079", definition: "The organization reviews and updates the security awareness and training policy in accordance with organization-defined frequency." },
  ],
  "AT-2":  [
    { cci: "CCI-000086", definition: "The organization provides basic security awareness training to information system users as part of initial training for new users." },
    { cci: "CCI-000087", definition: "The organization provides basic security awareness training to information system users when required by information system changes." },
    { cci: "CCI-000088", definition: "The organization provides basic security awareness training to information system users at an organization-defined frequency thereafter." },
  ],
  "AT-3":  [
    { cci: "CCI-000089", definition: "The organization provides role-based security training to personnel with assigned security roles and responsibilities before authorizing access to the information system or performing assigned duties." },
    { cci: "CCI-000090", definition: "The organization provides role-based security training to personnel with assigned security roles and responsibilities when required by information system changes." },
    { cci: "CCI-000091", definition: "The organization provides role-based security training to personnel with assigned security roles and responsibilities at an organization-defined frequency thereafter." },
  ],
  "AT-4":  [
    { cci: "CCI-000172", definition: "The organization documents and monitors individual information system security training activities including basic security awareness training and specific information system security training." },
    { cci: "CCI-000173", definition: "The organization retains individual training records for an organization-defined time period." },
  ],
  "AU-1":  [
    { cci: "CCI-000095", definition: "The organization develops an audit and accountability policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000096", definition: "The organization disseminates the audit and accountability policy to organization-defined personnel or roles." },
  ],
  "AU-2":  [
    { cci: "CCI-000130", definition: "The organization determines that the information system is capable of auditing organization-defined events." },
    { cci: "CCI-000131", definition: "The organization coordinates the security audit function with other organizations requiring audit-related information to enhance mutual support." },
    { cci: "CCI-000132", definition: "The organization provides a rationale for why the auditable events are deemed to be adequate to support after-the-fact investigations of security incidents." },
    { cci: "CCI-000133", definition: "The organization determines that the organization-defined auditable events are to be audited within the information system." },
  ],
  "AU-3":  [
    { cci: "CCI-000134", definition: "The information system produces audit records that contain sufficient information to establish what type of event occurred." },
    { cci: "CCI-000135", definition: "The information system produces audit records that contain sufficient information to establish when (date and time) an event occurred." },
    { cci: "CCI-000136", definition: "The information system produces audit records that contain sufficient information to establish where an event occurred." },
    { cci: "CCI-000137", definition: "The information system produces audit records that contain sufficient information to establish the source of the event." },
    { cci: "CCI-001462", definition: "The information system produces audit records that contain sufficient information to establish the outcome (success or failure) of the event." },
    { cci: "CCI-001463", definition: "The information system produces audit records that contain sufficient information to establish the identity of any individuals or subjects associated with the event." },
  ],
  "AU-4":  [
    { cci: "CCI-001464", definition: "The information system allocates audit record storage capacity in accordance with organization-defined audit record storage requirements." },
  ],
  "AU-5":  [
    { cci: "CCI-001467", definition: "The information system alerts organization-defined personnel or roles in the event of an audit processing failure." },
    { cci: "CCI-001468", definition: "The information system takes organization-defined actions upon audit failure." },
  ],
  "AU-6":  [
    { cci: "CCI-000140", definition: "The organization reviews and analyzes information system audit records for indications of organization-defined inappropriate or unusual activity." },
    { cci: "CCI-000141", definition: "The organization reports findings to organization-defined personnel or roles." },
  ],
  "AU-7":  [
    { cci: "CCI-000158", definition: "The information system provides an audit reduction and report generation capability that supports on-demand audit review, analysis, and reporting requirements and after-the-fact investigations of security incidents." },
    { cci: "CCI-000159", definition: "The information system provides an audit reduction and report generation capability that does not alter the original content or time ordering of audit records." },
  ],
  "AU-8":  [
    { cci: "CCI-000160", definition: "The information system uses internal system clocks to generate time stamps for audit records." },
    { cci: "CCI-001891", definition: "The information system records time stamps for audit records that can be mapped to Coordinated Universal Time (UTC) or Greenwich Mean Time (GMT)." },
  ],
  "AU-9":  [
    { cci: "CCI-000162", definition: "The information system protects audit information and audit tools from unauthorized access." },
    { cci: "CCI-000163", definition: "The information system protects audit information and audit tools from unauthorized modification." },
    { cci: "CCI-000164", definition: "The information system protects audit information and audit tools from unauthorized deletion." },
  ],
  "AU-10": [
    { cci: "CCI-000166", definition: "The information system protects against an individual (or process acting on behalf of an individual) falsely denying having performed organization-defined actions." },
  ],
  "AU-11": [
    { cci: "CCI-000167", definition: "The organization retains audit records for an organization-defined time period to provide support for after-the-fact investigations of security incidents." },
  ],
  "AU-12": [
    { cci: "CCI-000169", definition: "The information system provides audit record generation capability for the auditable events defined in AU-2 at all information system components where audit capability is deployed/available." },
    { cci: "CCI-000170", definition: "The information system allows organization-defined personnel or roles to select which auditable events are to be audited by specific components of the information system." },
    { cci: "CCI-000171", definition: "The information system generates audit records for the events defined in AU-2 with the content defined in AU-3." },
  ],
  "CA-1":  [
    { cci: "CCI-000695", definition: "The organization develops a security assessment and authorization policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000696", definition: "The organization disseminates the security assessment and authorization policy to organization-defined personnel or roles." },
  ],
  "CA-2":  [
    { cci: "CCI-000698", definition: "The organization develops a security assessment plan that describes the scope of the assessment including security controls and control enhancements under assessment." },
    { cci: "CCI-000699", definition: "The organization assesses the security controls in the information system and its environment of operation at an organization-defined frequency to determine the extent to which the controls are implemented correctly." },
    { cci: "CCI-000700", definition: "The organization produces a security assessment report that documents the results of the assessment." },
    { cci: "CCI-000701", definition: "The organization provides the results of the security control assessment to organization-defined individuals or roles." },
  ],
  "CA-5":  [
    { cci: "CCI-000703", definition: "The organization develops a plan of action and milestones for the information system to document the organization's planned remedial actions to correct weaknesses or deficiencies noted during the assessment." },
    { cci: "CCI-000704", definition: "The organization updates existing plan of action and milestones at an organization-defined frequency based on the findings from security controls assessments, security impact analyses, and continuous monitoring activities." },
  ],
  "CA-6":  [
    { cci: "CCI-000706", definition: "A senior organizational official authorizes the information system for processing before commencing operations." },
    { cci: "CCI-000707", definition: "A senior organizational official updates the security authorization at an organization-defined frequency." },
  ],
  "CA-7":  [
    { cci: "CCI-000711", definition: "The organization implements a continuous monitoring program that includes establishment of organization-defined metrics to be monitored." },
    { cci: "CCI-000712", definition: "The organization implements a continuous monitoring program that includes establishment of organization-defined frequencies for monitoring and frequencies for assessments supporting such monitoring." },
    { cci: "CCI-000713", definition: "The organization implements a continuous monitoring program that includes ongoing security control assessments in accordance with the organizational continuous monitoring strategy." },
    { cci: "CCI-000714", definition: "The organization implements a continuous monitoring program that includes ongoing security status monitoring of organization-defined metrics." },
    { cci: "CCI-000715", definition: "The organization implements a continuous monitoring program that includes correlation and analysis of security-related information generated by assessments and monitoring." },
    { cci: "CCI-000716", definition: "The organization implements a continuous monitoring program that includes response actions to address results of the analysis of security-related information." },
    { cci: "CCI-000717", definition: "The organization implements a continuous monitoring program that includes reporting the security status of organization and the information system to organization-defined personnel or roles at an organization-defined frequency." },
  ],
  "CA-8":  [
    { cci: "CCI-001170", definition: "The organization conducts penetration testing at an organization-defined frequency on organization-defined information systems or system components." },
  ],
  "CA-9":  [
    { cci: "CCI-001174", definition: "The organization authorizes internal connections of organization-defined information system components or classes of components to the information system." },
    { cci: "CCI-001175", definition: "The organization documents internal connections of organization-defined information system components or classes of components to the information system." },
  ],
  "CM-1":  [
    { cci: "CCI-000195", definition: "The organization develops a configuration management policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000196", definition: "The organization disseminates the configuration management policy to organization-defined personnel or roles." },
  ],
  "CM-2":  [
    { cci: "CCI-000197", definition: "The organization develops, documents, and maintains under configuration control, a current baseline configuration of the information system." },
  ],
  "CM-3":  [
    { cci: "CCI-000199", definition: "The organization determines the types of changes to the information system that are configuration-controlled." },
    { cci: "CCI-000200", definition: "The organization reviews proposed configuration-controlled changes to the information system and approves or disapproves such changes with explicit consideration for security impact analyses." },
    { cci: "CCI-000201", definition: "The organization documents configuration change decisions associated with the information system." },
    { cci: "CCI-000202", definition: "The organization implements approved configuration-controlled changes to the information system." },
    { cci: "CCI-000203", definition: "The organization retains records of configuration-controlled changes to the information system for an organization-defined time period." },
    { cci: "CCI-000204", definition: "The organization audits and reviews activities associated with configuration-controlled changes to the information system." },
  ],
  "CM-6":  [
    { cci: "CCI-000213", definition: "The organization establishes and documents configuration settings for information technology products employed within the information system that reflect the most restrictive mode consistent with operational requirements." },
    { cci: "CCI-000214", definition: "The organization implements the configuration settings." },
    { cci: "CCI-000215", definition: "The organization identifies, documents, and approves any deviations from established configuration settings for organization-defined information system components based on organization-defined operational requirements." },
    { cci: "CCI-000216", definition: "The organization monitors and controls changes to the configuration settings in accordance with organizational policies and procedures." },
  ],
  "CM-7":  [
    { cci: "CCI-000381", definition: "The organization configures the information system to provide only essential capabilities." },
    { cci: "CCI-000382", definition: "The organization prohibits or restricts the use of organization-defined functions, ports, protocols, and/or services." },
  ],
  "CM-8":  [
    { cci: "CCI-000500", definition: "The organization develops and documents an inventory of information system components that accurately reflects the current information system." },
    { cci: "CCI-000501", definition: "The organization develops and documents an inventory of information system components that includes all components within the authorization boundary of the information system." },
    { cci: "CCI-000502", definition: "The organization develops and documents an inventory of information system components that is at the level of granularity deemed necessary for tracking and reporting." },
    { cci: "CCI-000503", definition: "The organization reviews and updates the information system component inventory at an organization-defined frequency." },
  ],
  "CM-10": [
    { cci: "CCI-001443", definition: "The organization uses software and associated documentation in accordance with contract agreements and copyright laws." },
    { cci: "CCI-001444", definition: "The organization tracks the use of software and associated documentation protected by quantity licenses to control copying and distribution." },
    { cci: "CCI-001445", definition: "The organization controls and documents the use of peer-to-peer file sharing technology to ensure that this capability is not used for the unauthorized distribution, display, performance, or reproduction of copyrighted work." },
  ],
  "CM-11": [
    { cci: "CCI-001446", definition: "The organization establishes organization-defined policies governing the installation of software by users." },
    { cci: "CCI-001447", definition: "The organization enforces software installation policies through organization-defined methods." },
    { cci: "CCI-001448", definition: "The organization monitors policy compliance at an organization-defined frequency." },
  ],
  "CP-1":  [
    { cci: "CCI-000504", definition: "The organization develops a contingency planning policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000505", definition: "The organization disseminates the contingency planning policy to organization-defined personnel or roles." },
  ],
  "CP-2":  [
    { cci: "CCI-000518", definition: "The organization develops a contingency plan for the information system that identifies essential missions and business functions and associated contingency requirements." },
    { cci: "CCI-000519", definition: "The organization develops a contingency plan for the information system that provides recovery objectives, restoration priorities, and metrics." },
    { cci: "CCI-000520", definition: "The organization develops a contingency plan for the information system that addresses contingency roles, responsibilities, assigned individuals with contact information." },
    { cci: "CCI-000521", definition: "The organization develops a contingency plan for the information system that addresses maintaining essential missions and business functions despite an information system disruption, compromise, or failure." },
    { cci: "CCI-000522", definition: "The organization develops a contingency plan for the information system that addresses eventual, full information system restoration without deterioration of the security safeguards originally planned and implemented." },
  ],
  "CP-9":  [
    { cci: "CCI-000537", definition: "The organization conducts backups of user-level information contained in the information system at an organization-defined frequency." },
    { cci: "CCI-000538", definition: "The organization conducts backups of system-level information contained in the information system at an organization-defined frequency." },
    { cci: "CCI-000539", definition: "The organization conducts backups of information system documentation including security-related documentation at an organization-defined frequency." },
    { cci: "CCI-000540", definition: "The organization protects the confidentiality, integrity, and availability of backup information at storage locations." },
  ],
  "IA-1":  [
    { cci: "CCI-000761", definition: "The organization develops an identification and authentication policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000762", definition: "The organization disseminates the identification and authentication policy to organization-defined personnel or roles." },
  ],
  "IA-2":  [
    { cci: "CCI-000764", definition: "The information system uniquely identifies and authenticates organizational users (or processes acting on behalf of organizational users)." },
    { cci: "CCI-000765", definition: "The information system implements multifactor authentication for network access to privileged accounts." },
    { cci: "CCI-000766", definition: "The information system implements multifactor authentication for network access to non-privileged accounts." },
    { cci: "CCI-000767", definition: "The information system implements multifactor authentication for local access to privileged accounts." },
    { cci: "CCI-000768", definition: "The information system implements multifactor authentication for local access to non-privileged accounts." },
  ],
  "IA-4":  [
    { cci: "CCI-000795", definition: "The organization manages information system identifiers for users and devices by receiving authorization from organization-defined personnel or roles to assign an individual, group, role, or device identifier." },
    { cci: "CCI-000796", definition: "The organization manages information system identifiers for users and devices by selecting an identifier that identifies an individual, group, role, or device." },
    { cci: "CCI-000797", definition: "The organization manages information system identifiers for users and devices by assigning the identifier to the intended individual, group, role, or device." },
    { cci: "CCI-000798", definition: "The organization manages information system identifiers for users and devices by preventing reuse of identifiers for an organization-defined time period." },
    { cci: "CCI-000799", definition: "The organization manages information system identifiers for users and devices by disabling the identifier after an organization-defined time period of inactivity." },
  ],
  "IA-5":  [
    { cci: "CCI-000186", definition: "The information system, for PKI-based authentication, implements a local cache of revocation data to support path discovery and validation in case of inability to access revocation information via the network." },
    { cci: "CCI-000187", definition: "The information system, for password-based authentication, enforces minimum password complexity." },
    { cci: "CCI-000188", definition: "The information system, for password-based authentication, enforces at least an organization-defined number of changed characters when new passwords are created." },
    { cci: "CCI-000189", definition: "The information system, for password-based authentication, stores and transmits only cryptographically protected passwords." },
    { cci: "CCI-000190", definition: "The information system, for password-based authentication, enforces password minimum and maximum lifetime restrictions." },
    { cci: "CCI-000191", definition: "The information system, for password-based authentication, prohibits password reuse for an organization-defined number of generations." },
    { cci: "CCI-000192", definition: "The information system, for password-based authentication, allows the use of a temporary password for system logons with an immediate change to a permanent password." },
    { cci: "CCI-001619", definition: "The information system, for password-based authentication, enforces minimum password length." },
  ],
  "IA-6":  [
    { cci: "CCI-000206", definition: "The information system obscures feedback of authentication information during the authentication process to protect the information from possible exploitation/use by unauthorized individuals." },
  ],
  "IA-7":  [
    { cci: "CCI-000803", definition: "The information system implements mechanisms for authentication to a cryptographic module that meet the requirements of applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance for such authentication." },
  ],
  "IA-8":  [
    { cci: "CCI-000804", definition: "The information system uniquely identifies and authenticates non-organizational users (or processes acting on behalf of non-organizational users)." },
  ],
  "IR-1":  [
    { cci: "CCI-000810", definition: "The organization develops an incident response policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-000811", definition: "The organization disseminates the incident response policy to organization-defined personnel or roles." },
  ],
  "IR-4":  [
    { cci: "CCI-000816", definition: "The organization implements an incident handling capability for security incidents that includes preparation, detection and analysis, containment, eradication, and recovery." },
    { cci: "CCI-000817", definition: "The organization coordinates incident handling activities with contingency planning activities." },
    { cci: "CCI-000818", definition: "The organization incorporates lessons learned from ongoing incident handling activities into incident response procedures, training, and testing, and implements the resulting changes accordingly." },
  ],
  "IR-5":  [
    { cci: "CCI-000819", definition: "The organization tracks and documents information system security incidents." },
  ],
  "IR-6":  [
    { cci: "CCI-000832", definition: "The organization requires personnel to report suspected security incidents to the organizational incident response capability within an organization-defined time period." },
    { cci: "CCI-000833", definition: "The organization reports security incident information to organization-defined authorities." },
  ],
  "IR-8":  [
    { cci: "CCI-000835", definition: "The organization develops an incident response plan that provides the organization with a roadmap for implementing its incident response capability." },
    { cci: "CCI-000836", definition: "The organization develops an incident response plan that describes the structure and organization of the incident response capability." },
    { cci: "CCI-000837", definition: "The organization develops an incident response plan that provides a high-level approach for how the incident response capability fits into the overall organization." },
    { cci: "CCI-000838", definition: "The organization develops an incident response plan that meets the unique requirements of the organization, which relate to mission, size, structure, and functions." },
    { cci: "CCI-000839", definition: "The organization develops an incident response plan that defines reportable incidents." },
    { cci: "CCI-000840", definition: "The organization develops an incident response plan that provides metrics for measuring the incident response capability within the organization." },
    { cci: "CCI-000841", definition: "The organization develops an incident response plan that defines the resources and management support needed to effectively maintain and mature an incident response capability." },
    { cci: "CCI-000842", definition: "The organization develops an incident response plan that is reviewed and approved by organization-defined personnel or roles." },
  ],
  "MA-2":  [
    { cci: "CCI-000845", definition: "The organization schedules, performs, documents, and reviews records of maintenance and repairs on information system components in accordance with manufacturer or vendor specifications and/or organizational requirements." },
    { cci: "CCI-000846", definition: "The organization approves and monitors all maintenance activities, whether performed on-site or remotely and whether the equipment is serviced on-site or removed to another location." },
    { cci: "CCI-000847", definition: "The organization requires that organization-defined personnel or roles explicitly approve the removal of the information system or system components from organizational facilities for off-site maintenance or repairs." },
    { cci: "CCI-000848", definition: "The organization sanitizes equipment to remove all information from associated media prior to removal from organizational facilities for off-site maintenance or repairs." },
    { cci: "CCI-000849", definition: "The organization checks all potentially impacted security controls to verify that the controls are still functioning properly following maintenance or repair actions." },
  ],
  "MP-2":  [
    { cci: "CCI-001053", definition: "The organization restricts access to organization-defined types of digital and/or non-digital media to organization-defined personnel or roles." },
  ],
  "MP-6":  [
    { cci: "CCI-001067", definition: "The organization sanitizes organization-defined information system media prior to disposal, release out of organizational control, or release for reuse using organization-defined sanitization techniques and procedures." },
  ],
  "MP-7":  [
    { cci: "CCI-001068", definition: "The organization restricts or prohibits the use of organization-defined types of information system media on organization-defined information systems or system components using organization-defined security safeguards." },
  ],
  "PE-2":  [
    { cci: "CCI-001090", definition: "The organization develops and keeps current a list of individuals with authorized access to the facility where the information system resides." },
    { cci: "CCI-001091", definition: "The organization issues authorization credentials for facility access." },
    { cci: "CCI-001092", definition: "The organization reviews the access list detailing authorized facility access by individuals at an organization-defined frequency." },
    { cci: "CCI-001093", definition: "The organization removes individuals from the facility access list when access is no longer required." },
  ],
  "PE-3":  [
    { cci: "CCI-000732", definition: "The organization enforces physical access authorizations at organization-defined entry/exit points to the facility where the information system resides." },
    { cci: "CCI-000733", definition: "The organization verifies individual access authorizations before granting access to the facility." },
    { cci: "CCI-000734", definition: "The organization controls ingress and egress to the facility containing the information system using organization-defined physical access control systems/devices or guards." },
    { cci: "CCI-000735", definition: "The organization maintains physical access audit logs for organization-defined entry/exit points." },
    { cci: "CCI-000736", definition: "The organization provides security safeguards to control access to areas within the facility officially designated as publicly accessible." },
    { cci: "CCI-000737", definition: "The organization escorts visitors and monitors visitor activity in organization-defined circumstances requiring visitor escorts and monitoring." },
    { cci: "CCI-000738", definition: "The organization secures keys, combinations, and other physical access devices." },
    { cci: "CCI-000739", definition: "The organization inventories physical access devices at an organization-defined frequency." },
    { cci: "CCI-000740", definition: "The organization changes combinations and keys at an organization-defined frequency and/or when keys are lost, combinations are compromised, or individuals are transferred or terminated." },
  ],
  "PE-6":  [
    { cci: "CCI-000747", definition: "The organization monitors physical access to the information system to detect and respond to physical security incidents." },
    { cci: "CCI-000748", definition: "The organization reviews physical access logs at an organization-defined frequency." },
    { cci: "CCI-000749", definition: "The organization coordinates results of reviews and investigations with the organization's incident response capability." },
  ],
  "PL-2":  [
    { cci: "CCI-000091", definition: "The organization develops a security plan for the information system that is consistent with the organization's enterprise architecture." },
    { cci: "CCI-001453", definition: "The organization develops a security plan for the information system that explicitly defines the authorization boundary for the system." },
    { cci: "CCI-001454", definition: "The organization develops a security plan for the information system that describes the operational context of the information system in terms of missions and business processes." },
    { cci: "CCI-001455", definition: "The organization develops a security plan for the information system that provides the security categorization of the information system including supporting rationale." },
    { cci: "CCI-001456", definition: "The organization develops a security plan for the information system that describes the operational environment for the information system and relationships with or connections to other information systems." },
  ],
  "PS-2":  [
    { cci: "CCI-001173", definition: "The organization assigns a risk designation to all organizational positions." },
    { cci: "CCI-001174", definition: "The organization establishes screening criteria for individuals filling those positions." },
    { cci: "CCI-001175", definition: "The organization reviews and updates position risk designations at an organization-defined frequency." },
  ],
  "PS-3":  [
    { cci: "CCI-001178", definition: "The organization screens individuals prior to authorizing access to the information system." },
    { cci: "CCI-001179", definition: "The organization rescreens individuals according to organization-defined conditions requiring rescreening and, where rescreening is so indicated, the frequency of such rescreening." },
  ],
  "PS-4":  [
    { cci: "CCI-000182", definition: "The organization, upon termination of individual employment, disables information system access within an organization-defined time period." },
    { cci: "CCI-000183", definition: "The organization, upon termination of individual employment, terminates/revokes any authenticators/credentials associated with the individual." },
    { cci: "CCI-000184", definition: "The organization, upon termination of individual employment, conducts exit interviews that include a discussion of organization-defined information security topics." },
    { cci: "CCI-000185", definition: "The organization, upon termination of individual employment, retrieves all security-related organizational information system-related property." },
    { cci: "CCI-000186", definition: "The organization, upon termination of individual employment, retains access to organizational information and information systems formerly controlled by terminated individual." },
    { cci: "CCI-000187", definition: "The organization, upon termination of individual employment, notifies organization-defined personnel or roles within an organization-defined time period." },
  ],
  "RA-1":  [
    { cci: "CCI-001231", definition: "The organization develops a risk assessment policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination, and compliance." },
    { cci: "CCI-001232", definition: "The organization disseminates the risk assessment policy to organization-defined personnel or roles." },
  ],
  "RA-2":  [
    { cci: "CCI-001233", definition: "The organization categorizes information and the information system in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance." },
    { cci: "CCI-001234", definition: "The organization documents the security categorization results (including supporting rationale) in the security plan for the information system." },
    { cci: "CCI-001235", definition: "The organization ensures the security categorization decision is reviewed and approved by the authorizing official or authorizing official designated representative." },
  ],
  "RA-3":  [
    { cci: "CCI-001236", definition: "The organization conducts an assessment of risk, including the likelihood and magnitude of harm, from the unauthorized access, use, disclosure, disruption, modification, or destruction of the information system and the information it processes, stores, or transmits." },
    { cci: "CCI-001237", definition: "The organization documents risk assessment results in organization-defined document." },
    { cci: "CCI-001238", definition: "The organization reviews risk assessment results at an organization-defined frequency." },
    { cci: "CCI-001239", definition: "The organization disseminates risk assessment results to organization-defined personnel or roles." },
    { cci: "CCI-001240", definition: "The organization updates the risk assessment at an organization-defined frequency or whenever there are significant changes to the information system or environment of operation." },
  ],
  "RA-5":  [
    { cci: "CCI-001241", definition: "The organization scans for vulnerabilities in the information system and hosted applications at an organization-defined frequency and/or randomly in accordance with organization-defined process." },
    { cci: "CCI-001242", definition: "The organization scans for vulnerabilities in the information system and hosted applications when new vulnerabilities potentially affecting the system/applications are identified and reported." },
    { cci: "CCI-001243", definition: "The organization employs vulnerability scanning tools and techniques that facilitate interoperability among tools and automate parts of the vulnerability management process by using standards for enumerating platforms, software flaws, and improper configurations." },
    { cci: "CCI-001244", definition: "The organization analyzes vulnerability scan reports and results from security control assessments." },
    { cci: "CCI-001245", definition: "The organization remediates legitimate vulnerabilities in organization-defined response times in accordance with an organizational assessment of risk." },
    { cci: "CCI-001246", definition: "The organization shares information obtained from the vulnerability scanning process and security control assessments with organization-defined personnel or roles to help eliminate similar vulnerabilities in other information systems." },
  ],
  "SA-4":  [
    { cci: "CCI-001330", definition: "The organization includes in the acquisition contracts for the information system, system component, or information system service: security functional requirements, security strength requirements, security assurance requirements, security-related documentation requirements, and requirements for protecting security-related documentation." },
  ],
  "SA-9":  [
    { cci: "CCI-001348", definition: "The organization requires that providers of external information system services comply with organizational information security requirements and employ organization-defined security controls in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and guidance." },
    { cci: "CCI-001349", definition: "The organization defines and documents government oversight and user roles and responsibilities with regard to external information system services." },
    { cci: "CCI-001350", definition: "The organization employs organization-defined processes, methods, and techniques to monitor security control compliance by external service providers on an ongoing basis." },
  ],
  "SC-5":  [
    { cci: "CCI-001094", definition: "The information system protects against or limits the effects of organization-defined types of denial of service attacks." },
  ],
  "SC-7":  [
    { cci: "CCI-001095", definition: "The information system monitors and controls communications at the external boundary of the system and at key internal boundaries within the system." },
    { cci: "CCI-001096", definition: "The information system implements subnetworks for publicly accessible system components that are physically or logically separated from internal organizational networks." },
    { cci: "CCI-001097", definition: "The information system connects to external networks or information systems only through managed interfaces consisting of boundary protection devices arranged in accordance with organizational security architecture." },
  ],
  "SC-8":  [
    { cci: "CCI-002418", definition: "The information system protects the confidentiality of transmitted information." },
    { cci: "CCI-002419", definition: "The information system protects the integrity of transmitted information." },
    { cci: "CCI-002420", definition: "The information system implements cryptographic mechanisms to prevent unauthorized disclosure of information during transmission unless otherwise protected by alternative physical safeguards." },
    { cci: "CCI-002421", definition: "The information system implements cryptographic mechanisms to prevent unauthorized modification of information during transmission unless otherwise protected by alternative physical safeguards." },
  ],
  "SC-12": [
    { cci: "CCI-001106", definition: "The organization establishes and manages cryptographic keys for required cryptography employed within the information system in accordance with organization-defined requirements for key generation, distribution, storage, access, and destruction." },
  ],
  "SC-13": [
    { cci: "CCI-002450", definition: "The information system implements organization-defined cryptographic uses and type of cryptography required for each use in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards." },
  ],
  "SC-23": [
    { cci: "CCI-001184", definition: "The information system protects the authenticity of communications sessions." },
  ],
  "SC-28": [
    { cci: "CCI-001199", definition: "The information system protects the confidentiality and integrity of organization-defined information at rest." },
    { cci: "CCI-002475", definition: "The information system implements cryptographic mechanisms to prevent unauthorized disclosure of organization-defined information at rest unless otherwise protected by alternative physical safeguards." },
    { cci: "CCI-002476", definition: "The information system implements cryptographic mechanisms to prevent unauthorized modification of organization-defined information at rest unless otherwise protected by alternative physical safeguards." },
  ],
  "SC-39": [
    { cci: "CCI-001203", definition: "The information system maintains a separate execution domain for each executing process." },
  ],
  "SI-2":  [
    { cci: "CCI-001227", definition: "The organization identifies, reports, and corrects information system flaws." },
    { cci: "CCI-001228", definition: "The organization tests software and firmware updates related to flaw remediation for effectiveness and potential side effects before installation." },
    { cci: "CCI-001229", definition: "The organization installs security-relevant software updates within an organization-defined time period of the release of the updates." },
    { cci: "CCI-001230", definition: "The organization incorporates flaw remediation into the organizational configuration management process." },
  ],
  "SI-3":  [
    { cci: "CCI-001170", definition: "The organization employs malicious code protection mechanisms at information system entry and exit points to detect and eradicate malicious code." },
    { cci: "CCI-001171", definition: "The organization updates malicious code protection mechanisms whenever new releases are available in accordance with organizational configuration management policy and procedures." },
    { cci: "CCI-001172", definition: "The organization configures malicious code protection mechanisms to perform periodic scans of the information system and real-time scans of files from external sources at endpoints and network entry/exit points." },
    { cci: "CCI-001173", definition: "The organization configures malicious code protection mechanisms to block and quarantine malicious code and send alerts to the administrator in response to malicious code detection." },
  ],
  "SI-4":  [
    { cci: "CCI-001178", definition: "The organization monitors the information system to detect attacks and indicators of potential attacks in accordance with organization-defined monitoring objectives." },
    { cci: "CCI-001179", definition: "The organization monitors the information system to detect unauthorized local, network, and remote connections." },
    { cci: "CCI-001180", definition: "The organization identifies unauthorized use of the information system through organization-defined techniques and methods." },
    { cci: "CCI-001681", definition: "The organization deploys monitoring devices strategically within the information system to collect organization-determined essential information." },
    { cci: "CCI-001682", definition: "The organization protects information obtained from intrusion-monitoring tools from unauthorized access, modification, and deletion." },
  ],
  "SI-5":  [
    { cci: "CCI-001183", definition: "The organization receives information system security alerts, advisories, and directives from organization-defined external organizations on an ongoing basis." },
    { cci: "CCI-001184", definition: "The organization generates internal security alerts, advisories, and directives as deemed necessary." },
    { cci: "CCI-001185", definition: "The organization disseminates security alerts, advisories, and directives to organization-defined personnel or roles." },
    { cci: "CCI-001186", definition: "The organization implements security directives in accordance with established time frames, or notifies the issuing organization of the degree of noncompliance." },
  ],
  "SI-7":  [
    { cci: "CCI-001494", definition: "The information system detects unauthorized changes to software, firmware, and information." },
    { cci: "CCI-001495", definition: "The information system employs automated tools that notify organization-defined personnel or roles upon discovering discrepancies during integrity verification to protect the information system from unauthorized software." },
  ],
  "SI-12": [
    { cci: "CCI-001312", definition: "The organization manages and retains information within the information system and information output from the system in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, standards, and operational requirements." },
  ],
  "SR-2":  [
    { cci: "CCI-002530", definition: "The organization develops a plan for managing supply chain risks associated with the research and development, design, manufacturing, acquisition, delivery, integration, operations, maintenance, and disposal of the information system, system component, or information system service." },
  ],
  "SR-3":  [
    { cci: "CCI-002534", definition: "The organization establishes a process or processes to identify and address weaknesses or deficiencies in the supply chain elements and processes of organization-defined critical information system components." },
  ],
};

// Helper to get CCIs for a control
function getCCIs(controlId) {
  return CCI_MAP[controlId] || [];
}

const CTRL_STATUS_META = {
  "Implemented":     { color: "#1a7a4a", bg: "#d4f5e5", label: "Implemented",     icon: "✓" },
  "Not Implemented": { color: "#cc2222", bg: "#ffe0e0", label: "Not Implemented", icon: "✗" },
  "Compliant":       { color: "#1a3a7a", bg: "#d0dff5", label: "Compliant",       icon: "●" },
  "Non-Compliant":   { color: "#c45200", bg: "#ffe8d0", label: "Non-Compliant",   icon: "▲" },
  "Not Applicable":  { color: "#6b7a99", bg: "#e8eef6", label: "Not Applicable",  icon: "—" },
  "Inherited":       { color: "#6633bb", bg: "#ede0ff", label: "Inherited",       icon: "⇑" },
  "Planned":         { color: "#8a6200", bg: "#fff3c0", label: "Planned",         icon: "◷" },
}

// ── NIST 800-53 Control Mapping Data ────────────────────────────────────────
const PLUGIN_TO_CONTROL = {
  // ACAS Plugin ID → NIST 800-53 Controls
  "10144": ["SI-2", "SI-3"],
  "10180": ["CM-6", "CM-7"],
  "11213": ["AC-17", "SC-8"],
  "19506": ["IA-5", "IA-2"],
  "20007": ["SC-8", "SC-23"],
  "21745": ["CM-6", "SI-2"],
  "26928": ["AC-2", "AC-3"],
  "31705": ["AU-2", "AU-12"],
  "35291": ["SC-28", "MP-5"],
  "42897": ["CM-2", "CM-6"],
  "45590": ["RA-5", "SI-2"],
  "51192": ["SC-23", "SC-8"],
  "52611": ["AC-17", "IA-2"],
  "57608": ["CM-6", "CM-7"],
  "58651": ["AU-9", "AU-12"],
  "65057": ["AC-2", "IA-5"],
  "70658": ["SI-2", "RA-5"],
  "73182": ["CM-6", "SC-28"],
  "80101": ["IA-5", "IA-8"],
  "91579": ["RA-5", "SI-3"],
  "104631": ["CM-6", "SI-2"],
  "110385": ["AC-3", "AC-6"],
  "117887": ["AU-3", "AU-12"],
  "124269": ["SC-8", "SC-28"],
  "132494": ["RA-5", "SI-2"],
  "default": ["RA-5"]
};

const STIG_TO_CONTROL = {
  "V-220697": ["CM-6", "CM-7"],
  "V-220698": ["AC-2", "AC-3"],
  "V-220699": ["IA-5", "IA-2"],
  "V-220700": ["AU-2", "AU-12"],
  "V-220701": ["SC-8", "SC-23"],
  "V-220702": ["SI-2", "RA-5"],
  "V-220703": ["CM-6", "SI-3"],
  "V-220704": ["AC-17", "SC-8"],
  "V-220705": ["AU-9", "AU-12"],
  "V-220706": ["SC-28", "MP-5"],
  "V-220707": ["AC-6", "AC-3"],
  "V-220708": ["CM-2", "CM-6"],
  "V-220709": ["IA-8", "IA-5"],
  "V-220710": ["RA-5", "SI-2"],
  "V-220711": ["AC-2", "IA-2"],
  "V-220712": ["SC-23", "SC-8"],
  "V-220713": ["AU-3", "AU-12"],
  "V-220714": ["CM-7", "CM-6"],
  "V-220715": ["SI-3", "SI-2"],
  "V-220716": ["AC-17", "IA-5"],
  "default": ["CM-6"]
};

const SEVERITY_COLORS = {
  Critical: { bg: "#bb0000", text: "#fff", badge: "#cc2222" },
  High: { bg: "#c45200", text: "#fff", badge: "#c45200" },
  Medium: { bg: "#d4a000", text: "#1a1a1a", badge: "#a07800" },
  Low: { bg: "#1a7a4a", text: "#fff", badge: "#1a7a4a" },
  Info: { bg: "#1a6a9a", text: "#fff", badge: "#1a6a8a" }
};

const STATUS_COLORS = {
  Open: "#cc2222",
  "In Progress": "#c45200",
  Closed: "#1a7a4a",
  "Risk Accepted": "#6633bb",
  "False Positive": "#6b7a99"
};

const RMF_STEPS = [
  { id: 1, label: "CATEGORIZE", icon: "⬡", desc: "System Categorization" },
  { id: 2, label: "SELECT", icon: "⬡", desc: "Control Selection" },
  { id: 3, label: "IMPLEMENT", icon: "⬡", desc: "Control Implementation" },
  { id: 4, label: "ASSESS", icon: "⬡", desc: "Control Assessment" },
  { id: 5, label: "AUTHORIZE", icon: "⬡", desc: "System Authorization" },
  { id: 6, label: "MONITOR", icon: "⬡", desc: "Continuous Monitoring" }
];

// ── Utility Functions ─────────────────────────────────────────────────────
function mapToControls(type, id) {
  if (type === "acas") return PLUGIN_TO_CONTROL[id] || PLUGIN_TO_CONTROL["default"];
  if (type === "stig") return STIG_TO_CONTROL[id] || STIG_TO_CONTROL["default"];
  return ["RA-5"];
}

function uid() { return Math.random().toString(36).slice(2, 10).toUpperCase(); }

function today() { return new Date().toISOString().split("T")[0]; }

function parseStigCsv(text) {
  const lines = text.trim().split("\n");
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",");
    const stigId = cols[0]?.trim() || `V-${220697 + i}`;
    const title = cols[1]?.trim() || `STIG Finding ${i + 1}`;
    const severity = ["Critical","High","Medium","Low"][i % 4];
    return {
      id: uid(),
      source: "STIG",
      stigId,
      pluginId: null,
      title,
      severity,
      status: "Open",
      controls: mapToControls("stig", stigId),
      dateFound: today(),
      description: cols[2]?.trim() || "Imported STIG finding",
      remediation: cols[3]?.trim() || "Apply STIG guidance",
      poamId: null
    };
  }).filter(v => v.title);
}

function parseAcasCsv(text) {
  const lines = text.trim().split("\n");
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",");
    const pluginId = cols[0]?.trim() || `${10000 + i}`;
    const title = cols[1]?.trim() || `ACAS Finding ${i + 1}`;
    const severity = cols[4]?.trim() || ["Critical","High","Medium","Low"][i % 4];
    return {
      id: uid(),
      source: "ACAS",
      stigId: null,
      pluginId,
      title,
      severity,
      status: "Open",
      controls: mapToControls("acas", pluginId),
      dateFound: today(),
      description: cols[2]?.trim() || "Imported ACAS finding",
      remediation: cols[3]?.trim() || "Apply vendor patch",
      poamId: null
    };
  }).filter(v => v.title);
}

// ── CCI → NIST 800-53 Control Mapping ────────────────────────────────────
// Used by CKL parser as primary mapping strategy
const CCI_TO_CONTROLS = {
  // AC - Access Control
  "CCI-000001": ["AC-1"],  "CCI-000002": ["AC-1"],  "CCI-000003": ["AC-1"],  "CCI-000004": ["AC-1"],
  "CCI-000005": ["AC-1"],  "CCI-000006": ["AC-1"],  "CCI-000007": ["AC-1"],  "CCI-000008": ["AC-1"],
  "CCI-000009": ["AC-1"],  "CCI-000010": ["AC-1"],  "CCI-000011": ["AC-1"],  "CCI-000012": ["AC-1"],
  "CCI-000013": ["AC-1"],  "CCI-000014": ["AC-1"],
  "CCI-000015": ["AC-2"],  "CCI-000016": ["AC-2"],  "CCI-000017": ["AC-2"],  "CCI-000018": ["AC-2"],
  "CCI-000019": ["AC-2"],  "CCI-000020": ["AC-2"],  "CCI-000021": ["AC-2"],  "CCI-000022": ["AC-2"],
  "CCI-000023": ["AC-2"],  "CCI-000024": ["AC-2"],  "CCI-000025": ["AC-2"],  "CCI-000026": ["AC-2"],
  "CCI-000213": ["AC-3"],  "CCI-001368": ["AC-3"],  "CCI-001369": ["AC-3"],  "CCI-001370": ["AC-3"],
  "CCI-001414": ["AC-4"],  "CCI-001415": ["AC-4"],  "CCI-002388": ["AC-4"],  "CCI-002389": ["AC-4"],
  "CCI-002390": ["AC-4"],  "CCI-002391": ["AC-4"],  "CCI-002392": ["AC-4"],  "CCI-002393": ["AC-4"],
  "CCI-001084": ["AC-5"],  "CCI-001085": ["AC-5"],  "CCI-001086": ["AC-5"],
  "CCI-000225": ["AC-6"],  "CCI-001082": ["AC-6"],  "CCI-001083": ["AC-6"],  "CCI-002234": ["AC-6"],
  "CCI-002235": ["AC-6"],
  "CCI-000044": ["AC-7"],  "CCI-000045": ["AC-7"],  "CCI-002238": ["AC-7"],
  "CCI-000048": ["AC-8"],  "CCI-000049": ["AC-8"],  "CCI-001384": ["AC-8"],  "CCI-001385": ["AC-8"],
  "CCI-001386": ["AC-8"],  "CCI-001387": ["AC-8"],  "CCI-001388": ["AC-8"],
  "CCI-000056": ["AC-11"], "CCI-000057": ["AC-11"], "CCI-000058": ["AC-11"], "CCI-002010": ["AC-11"],
  "CCI-002361": ["AC-12"], "CCI-002362": ["AC-12"],
  "CCI-000060": ["AC-14"], "CCI-000061": ["AC-14"],
  "CCI-000063": ["AC-17"], "CCI-000064": ["AC-17"], "CCI-000065": ["AC-17"], "CCI-000066": ["AC-17"],
  "CCI-000067": ["AC-17"], "CCI-000068": ["AC-17"], "CCI-001453": ["AC-17"], "CCI-002314": ["AC-17"],
  "CCI-001452": ["AC-18"], "CCI-001454": ["AC-18"], "CCI-001455": ["AC-18"], "CCI-002418": ["AC-18"],
  "CCI-001456": ["AC-19"], "CCI-001457": ["AC-19"], "CCI-002007": ["AC-19"],
  "CCI-001483": ["AC-20"], "CCI-001484": ["AC-20"], "CCI-001485": ["AC-20"],
  "CCI-001488": ["AC-22"], "CCI-001489": ["AC-22"], "CCI-001490": ["AC-22"], "CCI-001491": ["AC-22"],
  // AT - Awareness and Training
  "CCI-000077": ["AT-1"],  "CCI-000078": ["AT-1"],  "CCI-000079": ["AT-1"],  "CCI-000080": ["AT-1"],
  "CCI-000081": ["AT-1"],
  "CCI-000082": ["AT-2"],  "CCI-000083": ["AT-2"],  "CCI-000084": ["AT-2"],  "CCI-000085": ["AT-2"],
  "CCI-000086": ["AT-2"],  "CCI-000087": ["AT-2"],  "CCI-000088": ["AT-2"],  "CCI-001749": ["AT-2"],
  "CCI-001750": ["AT-2"],
  "CCI-000089": ["AT-3"],  "CCI-000090": ["AT-3"],  "CCI-000091": ["AT-3"],  "CCI-001816": ["AT-3"],
  "CCI-001817": ["AT-3"],  "CCI-001818": ["AT-3"],  "CCI-001819": ["AT-3"],  "CCI-001820": ["AT-3"],
  "CCI-000172": ["AT-4"],  "CCI-000173": ["AT-4"],
  // AU - Audit and Accountability
  "CCI-000095": ["AU-1"],  "CCI-000096": ["AU-1"],  "CCI-000097": ["AU-1"],  "CCI-000098": ["AU-1"],
  "CCI-000130": ["AU-2"],  "CCI-000131": ["AU-2"],  "CCI-000132": ["AU-2"],  "CCI-000133": ["AU-2"],
  "CCI-001464": ["AU-4"],  "CCI-001851": ["AU-4"],
  "CCI-000134": ["AU-3"],  "CCI-000135": ["AU-3"],  "CCI-000136": ["AU-3"],  "CCI-000137": ["AU-3"],
  "CCI-000138": ["AU-3"],  "CCI-000139": ["AU-3"],  "CCI-001462": ["AU-3"],  "CCI-001463": ["AU-3"],
  "CCI-001467": ["AU-5"],  "CCI-001468": ["AU-5"],  "CCI-001855": ["AU-5"],  "CCI-001856": ["AU-5"],
  "CCI-001857": ["AU-5"],  "CCI-001858": ["AU-5"],  "CCI-001859": ["AU-5"],
  "CCI-000140": ["AU-6"],  "CCI-000141": ["AU-6"],  "CCI-001471": ["AU-6"],  "CCI-001472": ["AU-6"],
  "CCI-001473": ["AU-6"],
  "CCI-000158": ["AU-7"],  "CCI-000159": ["AU-7"],
  "CCI-000160": ["AU-8"],  "CCI-001891": ["AU-8"],  "CCI-002046": ["AU-8"],
  "CCI-000162": ["AU-9"],  "CCI-000163": ["AU-9"],  "CCI-000164": ["AU-9"],  "CCI-001493": ["AU-9"],
  "CCI-001494": ["AU-9"],  "CCI-001495": ["AU-9"],
  "CCI-000166": ["AU-10"],
  "CCI-000167": ["AU-11"], "CCI-001348": ["AU-11"],
  "CCI-000169": ["AU-12"], "CCI-000170": ["AU-12"], "CCI-000171": ["AU-12"], "CCI-001875": ["AU-12"],
  "CCI-001876": ["AU-12"], "CCI-001877": ["AU-12"], "CCI-001878": ["AU-12"], "CCI-001879": ["AU-12"],
  "CCI-001880": ["AU-12"], "CCI-001881": ["AU-12"], "CCI-001882": ["AU-12"],
  // CA - Assessment, Authorization and Monitoring
  "CCI-000695": ["CA-1"],  "CCI-000696": ["CA-1"],  "CCI-000697": ["CA-1"],
  "CCI-000698": ["CA-2"],  "CCI-000699": ["CA-2"],  "CCI-000700": ["CA-2"],  "CCI-000701": ["CA-2"],
  "CCI-001174": ["CA-3"],  "CCI-001175": ["CA-3"],  "CCI-002201": ["CA-3"],
  "CCI-000703": ["CA-5"],  "CCI-000704": ["CA-5"],
  "CCI-000706": ["CA-6"],  "CCI-000707": ["CA-6"],
  "CCI-000711": ["CA-7"],  "CCI-000712": ["CA-7"],  "CCI-000713": ["CA-7"],  "CCI-000714": ["CA-7"],
  "CCI-000715": ["CA-7"],  "CCI-000716": ["CA-7"],  "CCI-000717": ["CA-7"],  "CCI-001902": ["CA-7"],
  "CCI-001170": ["CA-8"],
  "CCI-001173": ["CA-9"],
  // CM - Configuration Management
  "CCI-000195": ["CM-1"],  "CCI-000196": ["CM-1"],
  "CCI-000197": ["CM-2"],  "CCI-000198": ["CM-2"],  "CCI-001552": ["CM-2"],  "CCI-001553": ["CM-2"],
  "CCI-001554": ["CM-2"],
  "CCI-000199": ["CM-3"],  "CCI-000200": ["CM-3"],  "CCI-000201": ["CM-3"],  "CCI-000202": ["CM-3"],
  "CCI-000203": ["CM-3"],  "CCI-000204": ["CM-3"],  "CCI-001596": ["CM-3"],  "CCI-001597": ["CM-3"],
  "CCI-001598": ["CM-3"],
  "CCI-001591": ["CM-4"],  "CCI-001592": ["CM-4"],
  "CCI-001593": ["CM-5"],  "CCI-001594": ["CM-5"],  "CCI-001595": ["CM-5"],
  "CCI-000213": ["CM-6"],  "CCI-000214": ["CM-6"],  "CCI-000215": ["CM-6"],  "CCI-000216": ["CM-6"],
  "CCI-001499": ["CM-6"],  "CCI-001619": ["CM-6"],  "CCI-002605": ["CM-6"],
  "CCI-000381": ["CM-7"],  "CCI-000382": ["CM-7"],  "CCI-001764": ["CM-7"],  "CCI-001765": ["CM-7"],
  "CCI-001766": ["CM-7"],  "CCI-001767": ["CM-7"],  "CCI-001768": ["CM-7"],
  "CCI-000500": ["CM-8"],  "CCI-000501": ["CM-8"],  "CCI-000502": ["CM-8"],  "CCI-000503": ["CM-8"],
  "CCI-001635": ["CM-8"],  "CCI-001636": ["CM-8"],
  "CCI-001443": ["CM-10"], "CCI-001444": ["CM-10"], "CCI-001445": ["CM-10"],
  "CCI-001446": ["CM-11"], "CCI-001447": ["CM-11"], "CCI-001448": ["CM-11"],
  // CP - Contingency Planning
  "CCI-000504": ["CP-1"],  "CCI-000505": ["CP-1"],
  "CCI-000518": ["CP-2"],  "CCI-000519": ["CP-2"],  "CCI-000520": ["CP-2"],  "CCI-000521": ["CP-2"],
  "CCI-000522": ["CP-2"],  "CCI-000523": ["CP-2"],  "CCI-000524": ["CP-2"],
  "CCI-000525": ["CP-3"],  "CCI-000526": ["CP-3"],  "CCI-000527": ["CP-3"],
  "CCI-000528": ["CP-4"],  "CCI-000529": ["CP-4"],  "CCI-000530": ["CP-4"],
  "CCI-000537": ["CP-9"],  "CCI-000538": ["CP-9"],  "CCI-000539": ["CP-9"],  "CCI-000540": ["CP-9"],
  "CCI-001681": ["CP-9"],  "CCI-001682": ["CP-9"],
  // IA - Identification and Authentication
  "CCI-000761": ["IA-1"],  "CCI-000762": ["IA-1"],  "CCI-000763": ["IA-1"],
  "CCI-000764": ["IA-2"],  "CCI-000765": ["IA-2"],  "CCI-000766": ["IA-2"],  "CCI-000767": ["IA-2"],
  "CCI-000768": ["IA-2"],  "CCI-001173": ["IA-2"],  "CCI-001174": ["IA-2"],  "CCI-001175": ["IA-2"],
  "CCI-001176": ["IA-2"],  "CCI-001177": ["IA-2"],  "CCI-002039": ["IA-2"],  "CCI-002041": ["IA-2"],
  "CCI-001958": ["IA-3"],  "CCI-001959": ["IA-3"],  "CCI-001960": ["IA-3"],  "CCI-001961": ["IA-3"],
  "CCI-001962": ["IA-3"],  "CCI-001963": ["IA-3"],
  "CCI-000795": ["IA-4"],  "CCI-000796": ["IA-4"],  "CCI-000797": ["IA-4"],  "CCI-000798": ["IA-4"],
  "CCI-000799": ["IA-4"],  "CCI-000800": ["IA-4"],  "CCI-000801": ["IA-4"],  "CCI-000802": ["IA-4"],
  "CCI-000186": ["IA-5"],  "CCI-000187": ["IA-5"],  "CCI-000188": ["IA-5"],  "CCI-000189": ["IA-5"],
  "CCI-000190": ["IA-5"],  "CCI-000191": ["IA-5"],  "CCI-000192": ["IA-5"],  "CCI-000193": ["IA-5"],
  "CCI-000194": ["IA-5"],  "CCI-001612": ["IA-5"],  "CCI-001613": ["IA-5"],  "CCI-001614": ["IA-5"],
  "CCI-001615": ["IA-5"],  "CCI-001616": ["IA-5"],  "CCI-001617": ["IA-5"],  "CCI-001618": ["IA-5"],
  "CCI-001619": ["IA-5"],  "CCI-002131": ["IA-5"],
  "CCI-000206": ["IA-6"],
  "CCI-000803": ["IA-7"],
  "CCI-000804": ["IA-8"],  "CCI-001353": ["IA-8"],  "CCI-001354": ["IA-8"],  "CCI-001355": ["IA-8"],
  "CCI-001356": ["IA-8"],
  // IR - Incident Response
  "CCI-000810": ["IR-1"],  "CCI-000811": ["IR-1"],
  "CCI-000812": ["IR-2"],  "CCI-000813": ["IR-2"],  "CCI-000814": ["IR-2"],
  "CCI-000815": ["IR-3"],  "CCI-001271": ["IR-3"],  "CCI-001272": ["IR-3"],
  "CCI-000816": ["IR-4"],  "CCI-000817": ["IR-4"],  "CCI-000818": ["IR-4"],  "CCI-001462": ["IR-4"],
  "CCI-001706": ["IR-4"],  "CCI-001707": ["IR-4"],  "CCI-002385": ["IR-4"],  "CCI-002386": ["IR-4"],
  "CCI-000819": ["IR-5"],  "CCI-001273": ["IR-5"],  "CCI-001274": ["IR-5"],
  "CCI-000832": ["IR-6"],  "CCI-000833": ["IR-6"],  "CCI-001275": ["IR-6"],
  "CCI-000835": ["IR-8"],  "CCI-000836": ["IR-8"],  "CCI-000837": ["IR-8"],  "CCI-000838": ["IR-8"],
  "CCI-000839": ["IR-8"],  "CCI-000840": ["IR-8"],  "CCI-000841": ["IR-8"],  "CCI-000842": ["IR-8"],
  // MA - Maintenance
  "CCI-000843": ["MA-1"],  "CCI-000844": ["MA-1"],
  "CCI-000845": ["MA-2"],  "CCI-000846": ["MA-2"],  "CCI-000847": ["MA-2"],  "CCI-000848": ["MA-2"],
  "CCI-000849": ["MA-2"],  "CCI-000850": ["MA-2"],
  "CCI-000851": ["MA-3"],  "CCI-000852": ["MA-3"],  "CCI-000853": ["MA-3"],  "CCI-000854": ["MA-3"],
  "CCI-001464": ["MA-4"],  "CCI-001469": ["MA-4"],  "CCI-001470": ["MA-4"],  "CCI-001471": ["MA-4"],
  "CCI-001472": ["MA-4"],  "CCI-001473": ["MA-4"],  "CCI-001474": ["MA-4"],
  "CCI-001479": ["MA-5"],  "CCI-001480": ["MA-5"],  "CCI-001481": ["MA-5"],
  // MP - Media Protection
  "CCI-001048": ["MP-1"],  "CCI-001049": ["MP-1"],
  "CCI-001053": ["MP-2"],  "CCI-001054": ["MP-2"],
  "CCI-001058": ["MP-4"],  "CCI-001059": ["MP-4"],
  "CCI-001062": ["MP-5"],  "CCI-001063": ["MP-5"],  "CCI-001064": ["MP-5"],  "CCI-001065": ["MP-5"],
  "CCI-001066": ["MP-5"],
  "CCI-001067": ["MP-6"],  "CCI-001068": ["MP-6"],  "CCI-002005": ["MP-6"],  "CCI-002006": ["MP-6"],
  "CCI-001068": ["MP-7"],
  // PE - Physical and Environmental Protection
  "CCI-001086": ["PE-1"],  "CCI-001087": ["PE-1"],
  "CCI-001090": ["PE-2"],  "CCI-001091": ["PE-2"],  "CCI-001092": ["PE-2"],  "CCI-001093": ["PE-2"],
  "CCI-000732": ["PE-3"],  "CCI-000733": ["PE-3"],  "CCI-000734": ["PE-3"],  "CCI-000735": ["PE-3"],
  "CCI-000736": ["PE-3"],  "CCI-000737": ["PE-3"],  "CCI-000738": ["PE-3"],  "CCI-000739": ["PE-3"],
  "CCI-000740": ["PE-3"],
  "CCI-000741": ["PE-4"],  "CCI-000742": ["PE-4"],
  "CCI-000747": ["PE-6"],  "CCI-000748": ["PE-6"],  "CCI-000749": ["PE-6"],
  "CCI-000753": ["PE-8"],  "CCI-000754": ["PE-8"],
  // PL - Planning
  "CCI-000091": ["PL-1"],  "CCI-000092": ["PL-1"],
  // PS - Personnel Security
  "CCI-001173": ["PS-2"],  "CCI-001174": ["PS-2"],  "CCI-001175": ["PS-2"],
  "CCI-001178": ["PS-3"],  "CCI-001179": ["PS-3"],
  "CCI-000182": ["PS-4"],  "CCI-000183": ["PS-4"],  "CCI-000184": ["PS-4"],  "CCI-000185": ["PS-4"],
  "CCI-000186": ["PS-4"],  "CCI-000187": ["PS-4"],
  "CCI-000188": ["PS-5"],  "CCI-000189": ["PS-5"],
  // RA - Risk Assessment
  "CCI-001231": ["RA-1"],  "CCI-001232": ["RA-1"],
  "CCI-001233": ["RA-2"],  "CCI-001234": ["RA-2"],  "CCI-001235": ["RA-2"],
  "CCI-001236": ["RA-3"],  "CCI-001237": ["RA-3"],  "CCI-001238": ["RA-3"],  "CCI-001239": ["RA-3"],
  "CCI-001240": ["RA-3"],
  "CCI-001241": ["RA-5"],  "CCI-001242": ["RA-5"],  "CCI-001243": ["RA-5"],  "CCI-001244": ["RA-5"],
  "CCI-001245": ["RA-5"],  "CCI-001246": ["RA-5"],  "CCI-002696": ["RA-5"],  "CCI-002697": ["RA-5"],
  "CCI-002698": ["RA-5"],  "CCI-002699": ["RA-5"],  "CCI-002700": ["RA-5"],  "CCI-002702": ["RA-5"],
  // SA - System and Services Acquisition
  "CCI-001278": ["SA-1"],  "CCI-001279": ["SA-1"],
  "CCI-001330": ["SA-4"],  "CCI-001331": ["SA-4"],  "CCI-001332": ["SA-4"],  "CCI-001333": ["SA-4"],
  "CCI-001334": ["SA-4"],  "CCI-001335": ["SA-4"],  "CCI-001336": ["SA-4"],
  "CCI-001348": ["SA-9"],  "CCI-001349": ["SA-9"],  "CCI-001350": ["SA-9"],
  // SC - System and Communications Protection
  "CCI-001094": ["SC-5"],  "CCI-002385": ["SC-5"],
  "CCI-001095": ["SC-7"],  "CCI-001096": ["SC-7"],  "CCI-001097": ["SC-7"],  "CCI-002399": ["SC-7"],
  "CCI-002400": ["SC-7"],  "CCI-002401": ["SC-7"],  "CCI-002402": ["SC-7"],  "CCI-002403": ["SC-7"],
  "CCI-002404": ["SC-7"],  "CCI-002405": ["SC-7"],  "CCI-002406": ["SC-7"],  "CCI-002407": ["SC-7"],
  "CCI-002418": ["SC-8"],  "CCI-002419": ["SC-8"],  "CCI-002420": ["SC-8"],  "CCI-002421": ["SC-8"],
  "CCI-001106": ["SC-12"], "CCI-001107": ["SC-12"], "CCI-001108": ["SC-12"], "CCI-001109": ["SC-12"],
  "CCI-001110": ["SC-12"], "CCI-001111": ["SC-12"], "CCI-001112": ["SC-12"],
  "CCI-002450": ["SC-13"], "CCI-002451": ["SC-13"],
  "CCI-001184": ["SC-23"],
  "CCI-001199": ["SC-28"], "CCI-002475": ["SC-28"], "CCI-002476": ["SC-28"],
  "CCI-001203": ["SC-39"],
  // SI - System and Information Integrity
  "CCI-001221": ["SI-1"],  "CCI-001222": ["SI-1"],
  "CCI-001227": ["SI-2"],  "CCI-001228": ["SI-2"],  "CCI-001229": ["SI-2"],  "CCI-001230": ["SI-2"],
  "CCI-002605": ["SI-2"],
  "CCI-001169": ["SI-3"],  "CCI-001170": ["SI-3"],  "CCI-001171": ["SI-3"],  "CCI-001172": ["SI-3"],
  "CCI-001173": ["SI-3"],
  "CCI-001178": ["SI-4"],  "CCI-001179": ["SI-4"],  "CCI-001180": ["SI-4"],  "CCI-001181": ["SI-4"],
  "CCI-001182": ["SI-4"],  "CCI-001183": ["SI-4"],  "CCI-001263": ["SI-4"],  "CCI-002661": ["SI-4"],
  "CCI-001183": ["SI-5"],  "CCI-001184": ["SI-5"],  "CCI-001185": ["SI-5"],  "CCI-001186": ["SI-5"],
  "CCI-001493": ["SI-7"],  "CCI-001494": ["SI-7"],  "CCI-001495": ["SI-7"],  "CCI-001496": ["SI-7"],
  "CCI-001312": ["SI-12"],
  // SR - Supply Chain Risk Management
  "CCI-002530": ["SR-2"],  "CCI-002531": ["SR-2"],  "CCI-002532": ["SR-2"],
  "CCI-002534": ["SR-3"],  "CCI-002535": ["SR-3"],
};

function cciToControls(cciList) {
  const controls = new Set();
  cciList.forEach(cci => {
    (CCI_TO_CONTROLS[cci] || []).forEach(c => controls.add(c));
  });
  return [...controls];
}

// ── CKL (STIG Checklist) XML Parser ──────────────────────────────────────
function parseCkl(xmlText) {
  // ── Strategy: try XML parser first, fall back to HTML parser ──────────
  // Real .ckl files are XML but often contain HTML entities or encoding
  // quirks that make strict XML parsing fail silently (0 VULN nodes).
  // The HTML parser (text/html) is far more tolerant.
  let doc = null;
  let parseMode = "xml";

  const xmlParser = new DOMParser();

  // First try: strict XML
  try {
    const xmlDoc = xmlParser.parseFromString(xmlText, "application/xml");
    const parseErr = xmlDoc.querySelector("parsererror");
    // Also check: if we got a doc but 0 VULNs it might be a silent failure
    if (!parseErr && xmlDoc.querySelectorAll("VULN").length > 0) {
      doc = xmlDoc;
    }
  } catch(e) { /* fall through */ }

  // Second try: HTML parser (handles malformed XML, entities, BOM, etc.)
  if (!doc) {
    parseMode = "html";
    doc = xmlParser.parseFromString(xmlText, "text/html");
  }

  if (!doc) return [];

  // Helper: case-insensitive tag query (HTML parser lowercases all tags)
  const q  = (el, tag) => el.querySelector(tag) || el.querySelector(tag.toLowerCase());
  const qa = (el, tag) => [...(el.querySelectorAll(tag).length ? el.querySelectorAll(tag) : el.querySelectorAll(tag.toLowerCase()))];

  // ── Extract STIG_INFO fields (benchmark-level metadata) ──────────────
  // SI_DATA elements use SID_NAME / SID_DATA pairs
  const stigInfo = {};
  qa(doc, "SI_DATA").forEach(si => {
    const nameEl = q(si, "SID_NAME");
    const dataEl = q(si, "SID_DATA");
    if (nameEl && dataEl) {
      stigInfo[nameEl.textContent.trim().toLowerCase()] = dataEl.textContent.trim();
    }
  });
  // stigInfo keys: version, stigid, title, releaseinfo, filename, description, etc.
  const benchmarkTitle   = stigInfo["title"]       || "Unknown STIG";
  const benchmarkVersion = stigInfo["version"]     || "";
  const benchmarkRelease = stigInfo["releaseinfo"] || ""; // e.g. "Release: 6 Benchmark Date: 05 Jan 2026"
  const benchmarkRef     = benchmarkTitle + (benchmarkVersion ? " V" + benchmarkVersion : "") + (benchmarkRelease ? " " + benchmarkRelease : "");

  // ── Parse each VULN element ───────────────────────────────────────────
  // CKL VULN_ATTRIBUTE field mapping (confirmed from STIG Viewer exports):
  //   Vuln_Num      → Group ID          e.g. V-279688
  //   Rule_ID       → Rule ID           e.g. SV-279688r1153564_rule
  //   Rule_Ver      → STIG ID (WN11-xx) e.g. WN11-00-000126
  //   Group_Title   → SRG ID            e.g. SRG-OS-000095-GPOS-00049
  //   Rule_Title    → Human-readable finding title (what STIG Viewer shows)
  //   Severity      → CAT level: high/medium/low
  //   Vuln_Discuss  → Vulnerability discussion / description
  //   Check_Content → How to check for the finding
  //   Fix_Text      → Remediation steps
  //   STIGRef       → Full benchmark reference string
  //   CCI_REF       → CCI number(s) — one per STIG_DATA node
  const vulnEls = qa(doc, "VULN");
  const findings = [];

  vulnEls.forEach(vuln => {
    const attrs = {};
    const cciList = [];

    qa(vuln, "STIG_DATA").forEach(sd => {
      const nameEl = q(sd, "VULN_ATTRIBUTE");
      const valEl  = q(sd, "ATTRIBUTE_DATA");
      if (!nameEl || !valEl) return;
      const attrName  = nameEl.textContent.trim();
      const attrValue = valEl.textContent.trim();

      if (attrName === "CCI_REF") {
        // Each CCI_REF is its own STIG_DATA block — collect all
        const ccis = attrValue.split(/[\s,]+/).filter(c => /^CCI-\d+$/.test(c));
        cciList.push(...ccis);
      } else {
        attrs[attrName] = attrValue; // last-write wins for non-CCI fields
      }
    });

    // ── Map CKL fields to their correct STIG Viewer meanings ─────────────
    const groupId    = attrs["Vuln_Num"]    || "";   // Group ID:  V-279688
    const ruleId     = attrs["Rule_ID"]     || "";   // Rule ID:   SV-279688r1153564_rule
    const stigId     = attrs["Rule_Ver"]    || "";   // STIG ID:   WN11-00-000126
    const srgId      = attrs["Group_Title"] || "";   // SRG ID:    SRG-OS-000095-GPOS-00049
    const ruleTitle  = attrs["Rule_Title"]  || "";   // Finding title (human-readable)
    const discussion = attrs["Vuln_Discuss"]  || "";
    const checkText  = attrs["Check_Content"] || "";
    const fixText    = attrs["Fix_Text"]      || "";
    const stigRef    = attrs["STIGRef"]       || benchmarkRef;
    const rawSev     = (attrs["Severity"] || "medium").toLowerCase().trim();

    // Title = Rule_Title (the actual human-readable finding name from STIG Viewer)
    const title = ruleTitle || stigId || groupId || "Unknown Finding";

    // Rich description preserving all STIG content sections
    const descParts = [];
    if (discussion) descParts.push("VULNERABILITY DISCUSSION:\n" + discussion);
    if (checkText)  descParts.push("CHECK CONTENT:\n" + checkText);
    const richDescription = descParts.join("\n\n") || "No description available.";

    // ── Severity — CAT I = High, CAT II = Medium, CAT III = Low ──────────
    const sevMap = {
      "high": "High", "medium": "Medium", "low": "Low", "critical": "Critical",
      "cat1": "High",  "cat 1": "High",  "cat i": "High",
      "cat2": "Medium","cat 2": "Medium","cat ii": "Medium",
      "cat3": "Low",   "cat 3": "Low",   "cat iii": "Low",
    };
    const severity = sevMap[rawSev] || "Medium";

    // ── Status ─────────────────────────────────────────────────────────────
    const statusEl  = q(vuln, "STATUS");
    const rawStatus = statusEl?.textContent?.trim() || "Not_Reviewed";
    const statusMap = {
      "Open":           "Open",
      "NotAFinding":    "Closed",
      "Not_Reviewed":   "In Progress",
      "Not Reviewed":   "In Progress",
      "Not Applicable": "False Positive",
      "Not_Applicable": "False Positive",
    };
    const status = statusMap[rawStatus] || "Open";

    const comments       = q(vuln, "COMMENTS")?.textContent?.trim()        || "";
    const findingDetails = q(vuln, "FINDING_DETAILS")?.textContent?.trim() || "";
    const sevOverride    = q(vuln, "SEVERITY_OVERRIDE")?.textContent?.trim()     || "";
    const sevJustify     = q(vuln, "SEVERITY_JUSTIFICATION")?.textContent?.trim() || "";

    // ── Control Mapping ───────────────────────────────────────────────────
    // Priority 1: CCI → NIST 800-53 (most authoritative)
    let controls = cciList.length > 0 ? cciToControls(cciList) : [];

    // Priority 2: STIG ID lookup
    if (controls.length === 0) {
      controls = STIG_TO_CONTROL[stigId] || STIG_TO_CONTROL[groupId] || STIG_TO_CONTROL[ruleId] || [];
    }

    // Priority 3: Keyword scan on rule title
    if (controls.length === 0 && ruleTitle) {
      const t = ruleTitle.toLowerCase();
      const kwMap = [
        [["password","credential","authenticat"],                  ["IA-5","IA-2"]],
        [["account","user account","group membership"],            ["AC-2"]],
        [["audit","log","logging","syslog"],                       ["AU-2","AU-12"]],
        [["privilege","least privilege","admin","root","sudo"],    ["AC-6","CM-6"]],
        [["encrypt","tls","ssl","cipher","fips"],                  ["SC-8","SC-13","SC-28"]],
        [["firewall","network access","port","service","daemon"],  ["SC-7","CM-7"]],
        [["patch","update","vuln","cve","hotfix"],                 ["SI-2","RA-5"]],
        [["banner","notice","warning","consent"],                  ["AC-8"]],
        [["session","timeout","lock","screensaver"],               ["AC-11","AC-12"]],
        [["antivirus","antimalware","malware","virus"],            ["SI-3"]],
        [["backup","recovery","contingency"],                      ["CP-9"]],
        [["remote","ssh","rdp","telnet","vnc"],                    ["AC-17"]],
        [["integrity","checksum","hash","signature"],              ["SI-7"]],
        [["configuration","baseline","hardening","stig"],         ["CM-6","CM-2"]],
        [["access control","permission","acl","dacl","sacl"],     ["AC-3","AC-6"]],
      ];
      for (const [keywords, ctrlIds] of kwMap) {
        if (keywords.some(kw => t.includes(kw))) { controls = ctrlIds; break; }
      }
    }

    // Priority 4: fallback
    if (controls.length === 0) controls = ["CM-6"];
    controls = [...new Set(controls)];

    if (groupId || stigId || (title && title !== "Unknown Finding")) {
      findings.push({
        id:            uid(),
        source:        "STIG",
        // Exact STIG Viewer field names preserved
        groupId,        // Group ID:  V-279688
        stigId,         // STIG ID:   WN11-00-000126  (Rule_Ver field)
        ruleId,         // Rule ID:   SV-279688r1153564_rule
        srgId,          // SRG ID:    SRG-OS-000095-GPOS-00049 (Group_Title field)
        ruleTitle,      // Human-readable title from Rule_Title
        title,          // = ruleTitle (what to display as the finding name)
        severity,
        status,
        rawStatus,
        controls,
        cciRefs:        [...new Set(cciList)],
        dateFound:      today(),
        description:    richDescription,
        remediation:    fixText ? "FIX TEXT:\n" + fixText : "Refer to STIG guidance for remediation steps.",
        findingDetails,
        comments,
        sevOverride,
        sevJustify,
        stigTitle:      benchmarkTitle,
        stigRef,        // Full benchmark string e.g. "Microsoft Windows 11 STIG V2R6..."
        pluginId:       null,
        poamId:         null,
        _parseMode:     parseMode,
      });
    }
  });

  return findings;
}


function Badge({ children, color = "#e8eef6", textColor = "#1a3a7a", small }) {
  return (
    <span style={{
      background: color, color: textColor,
      padding: small ? "2px 7px" : "3px 10px",
      borderRadius: 4, fontSize: small ? 10 : 11,
      fontFamily: "'DM Mono', monospace", fontWeight: 700,
      letterSpacing: 1, display: "inline-block"
    }}>{children}</span>
  );
}

function Modal({ title, onClose, children, width = 680 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,22,40,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(3px)"
    }}>
      <div style={{
        background: "#ffffff", border: "1px solid #c5d0de",
        borderRadius: 12, width, maxWidth: "96vw", maxHeight: "90vh",
        overflow: "auto", padding: 32, position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 20, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#6b7a99", cursor: "pointer",
            fontSize: 20, padding: "4px 8px", borderRadius: 4
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, style = {}, required }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: "block", color: "#3a4a6b", fontSize: 12, marginBottom: 6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{label}{required && " *"}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{
          width: "100%", background: "#e8eef6", border: "1px solid #c5d0de",
          borderRadius: 8, padding: "10px 14px", color: "#0a1628",
          fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none",
          boxSizing: "border-box", transition: "border 0.2s"
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: "block", color: "#3a4a6b", fontSize: 12, marginBottom: 6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: "#e8eef6", border: "1px solid #c5d0de",
        borderRadius: 8, padding: "10px 14px", color: "#0a1628",
        fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none",
        boxSizing: "border-box"
      }}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: "#3a4a6b", fontSize: 12, marginBottom: 6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{
        width: "100%", background: "#e8eef6", border: "1px solid #c5d0de",
        borderRadius: 8, padding: "10px 14px", color: "#0a1628",
        fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none",
        boxSizing: "border-box", resize: "vertical"
      }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small, style = {}, disabled }) {
  const variants = {
    primary: { background: "#1a3a7a", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "#3a4a6b", border: "1px solid #c5d0de" },
    danger: { background: "#cc2222", color: "#ff6b6b", border: "1px solid #ff3333" },
    success: { background: "#c8ecd8", color: "#1a7a4a", border: "1px solid #1a7a4a" },
    warning: { background: "#a07800", color: "#8a6200", border: "1px solid #d4a000" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant],
      padding: small ? "6px 14px" : "9px 20px",
      borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      fontSize: small ? 12 : 13, fontFamily: "'DM Mono', monospace",
      fontWeight: 700, letterSpacing: 0.5, transition: "all 0.15s",
      opacity: disabled ? 0.5 : 1, ...style
    }}>{children}</button>
  );
}

// ── RMF Step Tracker ─────────────────────────────────────────────────────
function RmfStepper({ step, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
      {RMF_STEPS.map((s, i) => {
        const active = step >= s.id;
        const current = step === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => onChange(s.id)} style={{
              background: active ? "#1a3a7a" : "#e8eef6",
              border: current ? "2px solid #1a5aaa" : "1px solid #c5d0de",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              transition: "all 0.2s", minWidth: 80
            }}>
              <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, color: active ? "#fff" : "#6b7a99", fontWeight: 700 }}>{s.label}</span>
            </button>
            {i < RMF_STEPS.length - 1 && <div style={{ width: 20, height: 2, background: step > s.id ? "#1a3a7a" : "#c5d0de", margin: "0 2px" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Systems View ──────────────────────────────────────────────────────────
function SystemsView({ systems, setSystems, vulnerabilities, controlStatuses, setControlStatuses, activeSystemId, setActiveSystemId }) {
  const [showCreate, setShowCreate]   = useState(false);
  const [editingId,  setEditingId]    = useState(null);   // system being edited
  const [activeTab,  setActiveTab]    = useState({});     // { [sysId]: "overview"|"fips"|"controls" }
  const [form, setForm] = useState({
    name:"", description:"", owner:"", classification:"Unclassified",
    type:"Major Application", environment:"Cloud", impact:"Moderate",
    rmfStep:1, atoDate:"", reviewDate:"",
    fips199:{
      confidentiality:{ level:"Moderate", rationale:"" },
      integrity:      { level:"Moderate", rationale:"" },
      availability:   { level:"Moderate", rationale:"" },
    }
  });

  const f  = (k)    => (v) => setForm(p => ({ ...p, [k]: v }));
  const ff = (obj, k) => (v) => setForm(p => ({ ...p, fips199: { ...p.fips199, [obj]: { ...p.fips199[obj], [k]: v } } }));

  // High-water-mark rule: overall = highest of C, I, A
  const hwm = (fips) => {
    const order = { Low:0, Moderate:1, High:2 };
    const levels = [fips.confidentiality.level, fips.integrity.level, fips.availability.level];
    return levels.reduce((a,b) => order[a] >= order[b] ? a : b, "Low");
  };

  const sysTab = (id) => activeTab[id] || "overview";
  const setTab = (id, tab) => setActiveTab(p => ({ ...p, [id]: tab }));

  const create = () => {
    if (!form.name) return;
    const derived = hwm(form.fips199);
    setSystems(p => [...p, { ...form, id: uid(), createdAt: today(), impact: derived, vulnerabilities: [] }]);
    setShowCreate(false);
    resetForm();
  };

  const saveEdit = (sysId) => {
    const derived = hwm(form.fips199);
    setSystems(p => p.map(s => s.id === sysId ? { ...form, id: sysId, impact: derived } : s));
    setEditingId(null);
  };

  const startEdit = (sys) => {
    setForm({
      ...sys,
      fips199: sys.fips199 || {
        confidentiality:{ level: sys.impact || "Moderate", rationale:"" },
        integrity:      { level: sys.impact || "Moderate", rationale:"" },
        availability:   { level: sys.impact || "Moderate", rationale:"" },
      }
    });
    setEditingId(sys.id);
  };

  const resetForm = () => setForm({
    name:"", description:"", owner:"", classification:"Unclassified",
    type:"Major Application", environment:"Cloud", impact:"Moderate",
    rmfStep:1, atoDate:"", reviewDate:"",
    fips199:{
      confidentiality:{ level:"Moderate", rationale:"" },
      integrity:      { level:"Moderate", rationale:"" },
      availability:   { level:"Moderate", rationale:"" },
    }
  });

  const updateStep = (sysId, step) => setSystems(p => p.map(s => s.id === sysId ? { ...s, rmfStep: step } : s));

  // FIPS 199 impact colors
  const impactColor = { Low: { bg:"#d4f5e5", color:"#1a7a4a" }, Moderate: { bg:"#fff3c0", color:"#8a6200" }, High: { bg:"#ffe0e0", color:"#cc2222" } };
  const ic = (lvl) => impactColor[lvl] || impactColor.Moderate;

  const statusKey = (sysId, ctrlId) => `${sysId}::${ctrlId}`;
  const getCtrlStatus = (sysId, ctrlId) => controlStatuses[statusKey(sysId,ctrlId)] || { status:"Not Implemented", notes:"", owner:"", notImplementedReason:"" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h2 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:22, margin:0 }}>Systems</h2>
          <p style={{ color:"#6b7a99", fontSize:13, margin:"4px 0 0", fontFamily:"'DM Mono', monospace" }}>{systems.length} registered systems</p>
        </div>
        <Btn onClick={() => { resetForm(); setShowCreate(true); }}>＋ New System</Btn>
      </div>

      {systems.length === 0 && (
        <div style={{ textAlign:"center", padding:64, color:"#8a9ab8", borderRadius:12, border:"1px dashed #c5d0de" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⬡</div>
          <p style={{ fontFamily:"'DM Mono', monospace" }}>No systems registered. Create your first system.</p>
        </div>
      )}

      <div style={{ display:"grid", gap:20 }}>
        {systems.map(sys => {
          const sysVulns = vulnerabilities.filter(v => v.systemId === sys.id);
          const open     = sysVulns.filter(v => v.status === "Open").length;
          const high     = sysVulns.filter(v => ["Critical","High"].includes(v.severity)).length;
          const fips     = sys.fips199 || { confidentiality:{ level:sys.impact||"Moderate", rationale:"" }, integrity:{ level:sys.impact||"Moderate", rationale:"" }, availability:{ level:sys.impact||"Moderate", rationale:"" } };
          const overallImpact = hwm(fips);
          const oc       = ic(overallImpact);
          const curTab   = sysTab(sys.id);

          // Controls for this system derived from vulnerabilities
          const sysControls = [...new Set(sysVulns.flatMap(v => v.controls||[]))].sort();
          // All baseline controls for system impact level
          const baselineMap = { Low:["Low","Moderate","High"], Moderate:["Moderate","High"], High:["High"] };
          const baselineControls = ALL_CONTROLS.filter(c => c.baseline.some(b => ["Low","Moderate","High"].slice(0, ["Low","Moderate","High"].indexOf(overallImpact)+1).includes(b) ));

          return (
            <div key={sys.id} style={{ background:"#ffffff", border:"1px solid #c5d0de", borderRadius:12, overflow:"hidden" }}>

              {/* ── System Header ── */}
              <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #e8eef6" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                      <h3 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:18, margin:0 }}>{sys.name}</h3>
                      <Badge color="#d0dff5" textColor="#1a5aaa">{sys.classification}</Badge>
                      <Badge color="#c8ecd8" textColor="#1a7a4a">{sys.type}</Badge>
                      <span style={{ background:oc.bg, color:oc.color, borderRadius:6, padding:"2px 10px", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700, border:`1px solid ${oc.color}` }}>
                        {overallImpact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p style={{ color:"#6b7a99", fontSize:12, fontFamily:"'DM Mono', monospace", margin:0 }}>{sys.description}</p>
                    <div style={{ marginTop:8, display:"flex", gap:16, flexWrap:"wrap" }}>
                      <span style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace" }}>Owner: <b>{sys.owner||"—"}</b></span>
                      <span style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace" }}>Env: <b>{sys.environment}</b></span>
                      {sys.atoDate && <span style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace" }}>ATO: <b style={{ color:"#8a6200" }}>{sys.atoDate}</b></span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    {[{ label:"OPEN", value:open, color:"#cc2222" }, { label:"HIGH+", value:high, color:"#c45200" }, { label:"TOTAL", value:sysVulns.length, color:"#0a1628" }].map(s => (
                      <div key={s.label} style={{ textAlign:"center", background:"#e8eef6", borderRadius:8, padding:"8px 14px" }}>
                        <div style={{ color:s.color, fontSize:20, fontWeight:900, fontFamily:"'Syne', sans-serif" }}>{s.value}</div>
                        <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace" }}>{s.label}</div>
                      </div>
                    ))}
                    <Btn small variant="secondary" onClick={() => startEdit(sys)}>✎ Edit</Btn>
                    {activeSystemId !== sys.id
                      ? <Btn small onClick={() => setActiveSystemId(sys.id)} style={{ background:"#1a4a8a", border:"none" }}>◎ Set Active</Btn>
                      : <span style={{ color:"#7caadf", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, padding:"6px 10px", background:"rgba(124,170,223,0.15)", borderRadius:7 }}>◉ Active</span>
                    }
                  </div>
                </div>
              </div>

              {/* ── Sub-tab bar ── */}
              <div style={{ display:"flex", background:"#f7faff", borderBottom:"1px solid #e8eef6" }}>
                {[
                  { id:"overview",  label:"📊 Overview" },
                  { id:"fips",      label:"🔒 FIPS 199 Categorization" },
                  { id:"controls",  label:`⊞ Controls (${sysControls.length})` },
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(sys.id, t.id)} style={{
                    background:"none", border:"none", borderBottom: curTab===t.id ? "2px solid #1a3a7a" : "2px solid transparent",
                    padding:"10px 20px", cursor:"pointer", color: curTab===t.id ? "#1a3a7a" : "#6b7a99",
                    fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight: curTab===t.id ? 700 : 400,
                    transition:"all 0.15s"
                  }}>{t.label}</button>
                ))}
              </div>

              {/* ── Overview Tab ── */}
              {curTab === "overview" && (
                <div style={{ padding:"16px 24px 20px" }}>
                  <RmfStepper step={sys.rmfStep} onChange={(step) => updateStep(sys.id, step)} />
                  {sysControls.length > 0 && (
                    <div style={{ marginTop:16 }}>
                      <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", marginBottom:8 }}>CONTROLS WITH FINDINGS</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {sysControls.map(c => {
                          const st = getCtrlStatus(sys.id, c);
                          const m  = CTRL_STATUS_META[st.status] || CTRL_STATUS_META["Not Implemented"];
                          return <span key={c} style={{ background:m.bg, color:m.color, borderRadius:4, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, border:`1px solid ${m.color}` }}>{c}</span>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── FIPS 199 Categorization Tab ── */}
              {curTab === "fips" && (
                <div style={{ padding:"20px 24px" }}>
                  {/* Header */}
                  <div style={{ background:"#f0f4f8", border:"1px solid #d0dde8", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
                    <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:900, marginBottom:4 }}>FIPS 199 — System Categorization</div>
                    <div style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", lineHeight:1.7 }}>
                      Per FIPS 199, categorize the potential impact on organizational operations, assets, and individuals if confidentiality, integrity, or availability is compromised. The overall system impact level is the <b>high-water mark</b> (highest) of the three security objectives.
                    </div>
                  </div>

                  {/* C / I / A rows */}
                  {[
                    { key:"confidentiality", label:"Confidentiality", icon:"🔒", desc:"Preserving authorized restrictions on information access and disclosure." },
                    { key:"integrity",       label:"Integrity",       icon:"✅", desc:"Guarding against improper information modification or destruction." },
                    { key:"availability",    label:"Availability",    icon:"⚡", desc:"Ensuring timely and reliable access to and use of information." },
                  ].map(obj => {
                    const val  = fips[obj.key];
                    const col  = ic(val.level);
                    return (
                      <div key={obj.key} style={{ background:"#f7faff", border:"1px solid #e0e8f0", borderRadius:10, padding:"16px 20px", marginBottom:14 }}>
                        <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                              <span style={{ fontSize:18 }}>{obj.icon}</span>
                              <span style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:900 }}>{obj.label}</span>
                              <span style={{ background:col.bg, color:col.color, borderRadius:5, padding:"2px 10px", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700, border:`1px solid ${col.color}` }}>{val.level}</span>
                            </div>
                            <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", marginBottom:10 }}>{obj.desc}</div>
                            <textarea
                              value={val.rationale||""}
                              readOnly
                              placeholder="No rationale recorded."
                              rows={2}
                              style={{ width:"100%", background:"#ffffff", border:"1px solid #c5d0de", borderRadius:6, padding:"8px 12px", color:"#3a4a6b", fontFamily:"'DM Mono', monospace", fontSize:11, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.6 }}
                            />
                          </div>
                          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                            {["Low","Moderate","High"].map(lvl => {
                              const lc = ic(lvl);
                              return (
                                <button key={lvl} disabled style={{ background: val.level===lvl ? lc.bg : "#e8eef6", border:`2px solid ${val.level===lvl ? lc.color : "#c5d0de"}`, borderRadius:7, padding:"8px 14px", cursor:"default", fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700, color: val.level===lvl ? lc.color : "#8a9ab8" }}>
                                  {lvl}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Overall result */}
                  <div style={{ background: oc.bg, border:`2px solid ${oc.color}`, borderRadius:10, padding:"14px 20px", display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ color:oc.color, fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:900, marginBottom:2 }}>OVERALL SYSTEM IMPACT LEVEL (HIGH-WATER MARK)</div>
                      <div style={{ color:oc.color, fontSize:11, fontFamily:"'DM Mono', monospace" }}>
                        {`SC-${sys.name || "System"} = {Confidentiality: ${fips.confidentiality.level}, Integrity: ${fips.integrity.level}, Availability: ${fips.availability.level}}`}
                      </div>
                    </div>
                    <div style={{ color:oc.color, fontFamily:"'Syne', sans-serif", fontSize:28, fontWeight:900 }}>{overallImpact.toUpperCase()}</div>
                  </div>
                  <div style={{ marginTop:12, textAlign:"right" }}>
                    <Btn small onClick={() => startEdit(sys)}>✎ Edit Categorization</Btn>
                  </div>
                </div>
              )}

              {/* ── Controls Sub-tab ── */}
              {curTab === "controls" && (
                <SystemControlsPanel
                  sys={sys}
                  sysVulns={sysVulns}
                  controlStatuses={controlStatuses}
                  setControlStatuses={setControlStatuses}
                  overallImpact={overallImpact}
                />
              )}

            </div>
          );
        })}
      </div>

      {/* ── Create / Edit Modal ── */}
      {(showCreate || editingId) && (
        <Modal title={editingId ? "Edit System" : "Register New System"} onClose={() => { setShowCreate(false); setEditingId(null); }} width={780}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Input label="SYSTEM NAME" value={form.name} onChange={f("name")} placeholder="e.g. ACME Financial System" required style={{ gridColumn:"1/-1" }} />
            <Input label="SYSTEM OWNER" value={form.owner} onChange={f("owner")} placeholder="e.g. John Smith" />
            <Select label="CLASSIFICATION" value={form.classification} onChange={f("classification")} options={["Unclassified","CUI","Secret","Top Secret"]} />
            <Select label="SYSTEM TYPE" value={form.type} onChange={f("type")} options={["Major Application","General Support System","Minor Application","Platform IT"]} />
            <Select label="ENVIRONMENT" value={form.environment} onChange={f("environment")} options={["Cloud","On-Premise","Hybrid","DoD Cloud"]} />
            <Input label="ATO DATE" value={form.atoDate||""} onChange={f("atoDate")} type="date" />
            <Input label="NEXT REVIEW DATE" value={form.reviewDate||""} onChange={f("reviewDate")} type="date" />
          </div>
          <Textarea label="DESCRIPTION" value={form.description} onChange={f("description")} placeholder="System description and purpose..." rows={2} />

          {/* FIPS 199 Section */}
          <div style={{ marginTop:18, borderTop:"2px solid #e8eef6", paddingTop:18 }}>
            <div style={{ color:"#1a3a7a", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700, letterSpacing:1, marginBottom:4 }}>FIPS 199 SECURITY CATEGORIZATION</div>
            <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", marginBottom:14, lineHeight:1.6 }}>
              Determine the potential impact on operations, assets, and individuals for each security objective. The <b>overall impact level</b> is automatically derived using the high-water mark rule.
            </div>

            {[
              { key:"confidentiality", label:"Confidentiality 🔒", desc:"Impact if unauthorized disclosure occurs" },
              { key:"integrity",       label:"Integrity ✅",       desc:"Impact if unauthorized modification or destruction occurs" },
              { key:"availability",    label:"Availability ⚡",    desc:"Impact if disruption of access or use occurs" },
            ].map(obj => {
              const val = form.fips199[obj.key];
              const col = ic(val.level);
              return (
                <div key={obj.key} style={{ background:"#f7faff", border:"1px solid #e0e8f0", borderRadius:10, padding:"14px 18px", marginBottom:12 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap", marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:900, marginBottom:2 }}>{obj.label}</div>
                      <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{obj.desc}</div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {["Low","Moderate","High"].map(lvl => {
                        const lc = ic(lvl);
                        return (
                          <button key={lvl} onClick={() => ff(obj.key, "level")(lvl)} style={{
                            background: val.level===lvl ? lc.bg : "#e8eef6",
                            border: `2px solid ${val.level===lvl ? lc.color : "#c5d0de"}`,
                            borderRadius:7, padding:"8px 16px", cursor:"pointer",
                            fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700,
                            color: val.level===lvl ? lc.color : "#8a9ab8", transition:"all 0.15s"
                          }}>{lvl}</button>
                        );
                      })}
                    </div>
                  </div>
                  <textarea
                    value={val.rationale||""}
                    onChange={e => ff(obj.key, "rationale")(e.target.value)}
                    placeholder={`Rationale for ${obj.label.split(" ")[0]} ${val.level} impact...`}
                    rows={2}
                    style={{ width:"100%", background:"#ffffff", border:"1px solid #c5d0de", borderRadius:6, padding:"8px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:11, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.6 }}
                  />
                </div>
              );
            })}

            {/* Derived overall impact */}
            {(() => {
              const derived = hwm(form.fips199);
              const dc = ic(derived);
              return (
                <div style={{ background:dc.bg, border:`2px solid ${dc.color}`, borderRadius:8, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ color:dc.color, fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:1 }}>DERIVED OVERALL IMPACT LEVEL (HIGH-WATER MARK)</div>
                    <div style={{ color:dc.color, fontSize:11, fontFamily:"'DM Mono', monospace", marginTop:3 }}>
                      C:{form.fips199.confidentiality.level} · I:{form.fips199.integrity.level} · A:{form.fips199.availability.level}
                    </div>
                  </div>
                  <div style={{ color:dc.color, fontFamily:"'Syne', sans-serif", fontSize:26, fontWeight:900 }}>{derived}</div>
                </div>
              );
            })()}
          </div>

          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:20 }}>
            <Btn variant="secondary" onClick={() => { setShowCreate(false); setEditingId(null); }}>Cancel</Btn>
            <Btn onClick={() => editingId ? saveEdit(editingId) : create()} disabled={!form.name}>
              {editingId ? "Save Changes" : "Create System"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── System Controls Panel (sub-tab inside SystemsView) ────────────────────
function SystemControlsPanel({ sys, sysVulns, controlStatuses, setControlStatuses, overallImpact }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");
  const [search, setSearch]             = useState("");
  const [editingCtrl, setEditingCtrl]   = useState(null);
  const [editForm, setEditForm]         = useState({});
  const ef = (k) => (v) => setEditForm(p => ({ ...p, [k]: v }));

  const statusKey = (sysId, ctrlId) => `${sysId}::${ctrlId}`;

  // Controls that appear in this system's vulnerabilities
  const affectedIds = new Set(sysVulns.flatMap(v => v.controls||[]));

  // Baseline controls for this system's impact level
  const impactOrder = ["Low","Moderate","High"];
  const baselineControls = ALL_CONTROLS.filter(c =>
    c.baseline.some(b => impactOrder.indexOf(b) <= impactOrder.indexOf(overallImpact))
  );

  const getStatus = (ctrlId) => controlStatuses[statusKey(sys.id, ctrlId)] ||
    { status:"Not Implemented", notes:"", owner:"", notImplementedReason:"" };

  const saveStatus = () => {
    const key = statusKey(sys.id, editingCtrl.id);
    setControlStatuses(p => ({ ...p, [key]: { ...editForm, manuallySet: true } }));
    setEditingCtrl(null);
  };

  // Auto-derive status from findings
  const autoStatus = (ctrlId) => {
    const vulns = sysVulns.filter(v => (v.controls||[]).includes(ctrlId));
    if (!vulns.length) return null;
    const open = vulns.filter(v => v.status === "Open");
    if (open.some(v => ["Critical","High"].includes(v.severity))) return "Non-Compliant";
    if (open.length > 0) return "Non-Compliant";
    return "Compliant";
  };

  const filtered = baselineControls.filter(c => {
    const st = getStatus(c.id);
    const auto = autoStatus(c.id);
    const effectiveStatus = auto || st.status;
    if (filterStatus !== "all" && effectiveStatus !== filterStatus) return false;
    if (filterFamily !== "all" && c.family !== filterFamily) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Stats
  const statusCounts = {};
  baselineControls.forEach(c => {
    const key = autoStatus(c.id) || getStatus(c.id).status;
    statusCounts[key] = (statusCounts[key]||0) + 1;
  });
  const implemented = (statusCounts["Implemented"]||0) + (statusCounts["Compliant"]||0) + (statusCounts["Inherited"]||0);
  const pct = Math.round(implemented / baselineControls.length * 100);

  const statusMeta = {
    "Implemented":     { color:"#1a7a4a", bg:"#d4f5e5", icon:"✓" },
    "Compliant":       { color:"#1a3a7a", bg:"#d0dff5", icon:"●" },
    "Non-Compliant":   { color:"#c45200", bg:"#ffe8d0", icon:"▲" },
    "Not Implemented": { color:"#cc2222", bg:"#ffe0e0", icon:"✗" },
    "Not Applicable":  { color:"#6b7a99", bg:"#e8eef6", icon:"—" },
    "Inherited":       { color:"#6633bb", bg:"#ede0ff", icon:"⇑" },
    "Planned":         { color:"#8a6200", bg:"#fff3c0", icon:"◷" },
  };

  return (
    <div style={{ padding:"20px 24px" }}>
      {/* Stats bar */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:16, alignItems:"center" }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
              {overallImpact.toUpperCase()} BASELINE — {baselineControls.length} controls
            </span>
            <span style={{ color: pct>=80?"#1a7a4a":pct>=50?"#8a6200":"#cc2222", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ background:"#e8eef6", borderRadius:6, height:8, overflow:"hidden", display:"flex" }}>
            <div style={{ width:`${(statusCounts["Implemented"]||0)/baselineControls.length*100}%`, background:"#1a7a4a" }} />
            <div style={{ width:`${(statusCounts["Compliant"]||0)/baselineControls.length*100}%`, background:"#1a3a7a" }} />
            <div style={{ width:`${(statusCounts["Inherited"]||0)/baselineControls.length*100}%`, background:"#6633bb" }} />
            <div style={{ width:`${(statusCounts["Non-Compliant"]||0)/baselineControls.length*100}%`, background:"#c45200" }} />
            <div style={{ width:`${(statusCounts["Not Implemented"]||0)/baselineControls.length*100}%`, background:"#cc2222" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {Object.entries(statusCounts).filter(([,v])=>v>0).map(([s,n]) => {
            const m = statusMeta[s]||statusMeta["Not Implemented"];
            return (
              <div key={s} onClick={() => setFilterStatus(filterStatus===s?"all":s)}
                style={{ background:m.bg, border:`1px solid ${m.color}`, borderRadius:7, padding:"5px 10px", cursor:"pointer", opacity: filterStatus!=="all"&&filterStatus!==s?0.4:1, transition:"opacity 0.15s" }}>
                <div style={{ color:m.color, fontSize:15, fontWeight:900, fontFamily:"'Syne', sans-serif", textAlign:"center" }}>{n}</div>
                <div style={{ color:m.color, fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:0.5 }}>{s.split(" ").map(w=>w[0]).join("")}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search controls…"
          style={{ background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"7px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", width:180 }} />
        <select value={filterFamily} onChange={e=>setFilterFamily(e.target.value)}
          style={{ background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"7px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12 }}>
          <option value="all">All Families</option>
          {Object.entries(CONTROL_FAMILIES).map(([k,v]) => <option key={k} value={k}>{k} – {v}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
          style={{ background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"7px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12 }}>
          <option value="all">All Statuses</option>
          {Object.keys(statusMeta).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ color:"#8a9ab8", fontSize:12, fontFamily:"'DM Mono', monospace", alignSelf:"center" }}>{filtered.length} controls</span>
      </div>

      {/* Control rows */}
      <div style={{ display:"grid", gap:6, maxHeight:520, overflowY:"auto", paddingRight:4 }}>
        {filtered.map(ctrl => {
          const manual     = getStatus(ctrl.id);
          const auto       = autoStatus(ctrl.id);
          const effectiveSt = auto || manual.status;
          const m          = statusMeta[effectiveSt] || statusMeta["Not Implemented"];
          const ctrlVulns  = sysVulns.filter(v => (v.controls||[]).includes(ctrl.id));
          const openVulns  = ctrlVulns.filter(v => v.status==="Open");
          const hasReason  = manual.notImplementedReason?.trim();

          return (
            <div key={ctrl.id} style={{ background:"#ffffff", border:`1px solid ${affectedIds.has(ctrl.id)?"#c0d4f0":"#e0e8f0"}`, borderLeft:`4px solid ${m.color}`, borderRadius:8, padding:"12px 16px", display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ color:"#1a4a8a", fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:900 }}>{ctrl.id}</span>
                  <span style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace" }}>{ctrl.title}</span>
                  <Badge color="#d0f0e0" textColor="#1a7a4a" small>{ctrl.family}</Badge>
                  {auto && <span style={{ fontSize:9, color:"#6b7a99", fontFamily:"'DM Mono', monospace", background:"#f0f4f8", border:"1px solid #c5d0de", borderRadius:3, padding:"1px 5px" }}>auto</span>}
                  {manual.manuallySet && <span style={{ fontSize:9, color:"#1a3a7a", fontFamily:"'DM Mono', monospace", background:"#d0dff5", border:"1px solid #1a3a7a", borderRadius:3, padding:"1px 5px" }}>manual</span>}
                </div>

                {/* Not-implemented reason */}
                {(effectiveSt === "Not Implemented" || effectiveSt === "Planned") && hasReason && (
                  <div style={{ background:"#fff8e8", border:"1px solid #e8c840", borderRadius:5, padding:"5px 10px", marginTop:4, fontSize:11, fontFamily:"'DM Mono', monospace", color:"#6b4e00" }}>
                    ⚠ {manual.notImplementedReason}
                  </div>
                )}

                {/* Finding pills */}
                {ctrlVulns.length > 0 && (
                  <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
                    {openVulns.slice(0,3).map(v => {
                      const sev = SEVERITY_COLORS[v.severity]||SEVERITY_COLORS.Info;
                      return <span key={v.id} style={{ background:sev.badge||sev.bg, color:sev.text, borderRadius:4, padding:"1px 7px", fontSize:9, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{v.severity}: {v.stigId||v.pluginId||v.title.slice(0,24)}</span>;
                    })}
                    {openVulns.length>3 && <span style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace" }}>+{openVulns.length-3} more</span>}
                  </div>
                )}

                {manual.notes && <div style={{ marginTop:4, color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", fontStyle:"italic" }}>{manual.notes}</div>}
              </div>

              <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                {openVulns.length>0 && <span style={{ background:"#ffe0e0", color:"#cc2222", borderRadius:5, padding:"3px 8px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{openVulns.length} open</span>}
                <div style={{ background:m.bg, border:`1px solid ${m.color}`, borderRadius:16, padding:"4px 12px", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color:m.color, fontSize:10 }}>{m.icon}</span>
                  <span style={{ color:m.color, fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{effectiveSt}</span>
                </div>
                <Btn small variant="secondary" onClick={() => { setEditingCtrl(ctrl); setEditForm({ ...manual }); }}>Edit</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editingCtrl && (
        <Modal title={`${editingCtrl.id} — ${editingCtrl.title}`} onClose={() => setEditingCtrl(null)} width={660}>
          <div style={{ background:"#e8eef6", borderRadius:8, padding:"12px 16px", marginBottom:16, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Badge color="#d0f0e0" textColor="#1a7a4a">{editingCtrl.family} — {CONTROL_FAMILIES[editingCtrl.family]}</Badge>
            {editingCtrl.baseline.map(b=><Badge key={b} color="#d0dff5" textColor="#1a3a7a" small>{b} Baseline</Badge>)}
          </div>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:10 }}>IMPLEMENTATION STATUS</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(statusMeta).map(([status, m]) => (
                <button key={status} onClick={() => ef("status")(status)} style={{
                  background: editForm.status===status ? m.bg : "#e8eef6",
                  border: `2px solid ${editForm.status===status ? m.color : "#c5d0de"}`,
                  borderRadius:8, padding:"10px 14px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:10, transition:"all 0.15s"
                }}>
                  <span style={{ color:m.color, fontSize:16 }}>{m.icon}</span>
                  <span style={{ color: editForm.status===status ? m.color : "#6b7a99", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700 }}>{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Not Implemented / Planned */}
          {(editForm.status === "Not Implemented" || editForm.status === "Planned") && (
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", color:"#c45200", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>
                REASON NOT IMPLEMENTED *
              </label>
              <textarea
                value={editForm.notImplementedReason||""}
                onChange={e => ef("notImplementedReason")(e.target.value)}
                rows={3}
                placeholder="Explain why this control is not yet implemented, any constraints, or the plan to address it..."
                style={{ width:"100%", background:"#fffaf0", border:"2px solid #c45200", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }}
              />
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <Input label="CONTROL OWNER" value={editForm.owner||""} onChange={ef("owner")} placeholder="e.g. ISSO / Jane Smith" />
            <Input label="LAST REVIEWED" value={editForm.lastReviewed||""} onChange={ef("lastReviewed")} type="date" />
          </div>
          <Textarea label="IMPLEMENTATION NOTES" value={editForm.notes||""} onChange={ef("notes")} rows={3}
            placeholder="Describe how this control is implemented or any gaps..." />

          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:16 }}>
            <Btn variant="secondary" onClick={() => setEditingCtrl(null)}>Cancel</Btn>
            <Btn onClick={saveStatus}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Vulnerabilities View ──────────────────────────────────────────────────
function VulnerabilitiesView({ vulnerabilities, setVulnerabilities, systems, setPoams, defaultSystemId }) {
  const [filter, setFilter] = useState({ system: "all", severity: "all", status: "all", source: "all" });
  const [selected, setSelected] = useState(null);
  const [showIngest, setShowIngest] = useState(false);
  const [ingestType, setIngestType] = useState("ckl");
  const [ingestText, setIngestText] = useState("");
  const [ingestSystemId, setIngestSystemId] = useState(defaultSystemId || "");
  const [cklPreview, setCklPreview] = useState(null); // parsed findings before confirm
  const [cklFileName, setCklFileName] = useState("");
  const [cklParseError, setCklParseError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualForm, setManualForm] = useState({ title: "", severity: "High", source: "STIG", stigId: "", pluginId: "", description: "", remediation: "", systemId: defaultSystemId || "", status: "Open" });

  const mf = (k) => (v) => setManualForm(p => ({ ...p, [k]: v }));
  useEffect(() => { if (defaultSystemId) setIngestSystemId(defaultSystemId); }, [defaultSystemId]);

  const filtered = vulnerabilities.filter(v =>
    (filter.system === "all" || v.systemId === filter.system) &&
    (filter.severity === "all" || v.severity === filter.severity) &&
    (filter.status === "all" || v.status === filter.status) &&
    (filter.source === "all" || v.source === filter.source)
  );

  // Handle CKL file drop / select
  const handleCklFile = (file) => {
    if (!file) return;
    setCklFileName(file.name);
    setCklParseError("");
    setCklPreview(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Strip UTF-8 BOM if present
        const raw = e.target.result.replace(/^﻿/, "");
        const parsed = parseCkl(raw);
        if (parsed.length === 0) {
          setCklParseError(
            "No findings parsed. Verify this is a valid STIG Viewer .ckl export. " +
            "The file must contain <VULN> elements with <STIG_DATA> children."
          );
        }
        setCklPreview(parsed);
      } catch (err) {
        setCklParseError("Parse error: " + err.message);
        setCklPreview([]);
      }
    };
    reader.onerror = () => {
      setCklParseError("Could not read file.");
      setCklPreview([]);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleCklDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".ckl") || file.name.endsWith(".xml"))) handleCklFile(file);
  };

  const confirmCklIngest = () => {
    if (!cklPreview || !ingestSystemId) return;
    const sys = systems.find(s => s.id === ingestSystemId);
    const withSystem = cklPreview.map(v => ({ ...v, systemId: ingestSystemId }));

    // Auto-create a POAM for every Open or Not-Reviewed finding
    const autoPoams = [];
    const vulnsWithPoamIds = withSystem.map(v => {
      const needsPoam = v.status === "Open" || v.status === "In Progress";
      if (!needsPoam) return v;

      // Skip if a POAM already exists for this stigId+systemId combo
      const dupe = autoPoams.find(p => p.stigId === v.stigId && p.systemId === ingestSystemId);
      if (dupe) return { ...v, poamId: dupe.id };

      const daysOut  = { Critical:30, High:30, Medium:90, Low:180, Info:180 }[v.severity] || 90;
      const due      = new Date(); due.setDate(due.getDate() + daysOut);
      const poamId   = uid();

      // Build milestones based on severity
      const milestones = (v.severity === "Critical" || v.severity === "High")
        ? "1. Assign remediation owner (Day 1)\n2. Develop remediation plan (Day 7)\n3. Implement fix (Day 14)\n4. Validate and test fix (Day 21)\n5. Close POAM (Day 30)"
        : "1. Assign remediation owner (Day 1)\n2. Develop remediation plan (Day 14)\n3. Schedule maintenance window\n4. Implement fix\n5. Validate and close POAM";

      const poam = {
        id:                  poamId,
        vulnId:              v.id,
        systemId:            ingestSystemId,
        severity:            v.severity,
        source:              "STIG",
        stigId:              v.stigId   || null,  // WN11-00-000126
        ruleId:              v.ruleId   || null,  // SV-279688r...
        groupId:             v.groupId  || null,  // V-279688
        srgId:               v.srgId   || null,  // SRG-OS-...
        ruleTitle:           v.ruleTitle || null,
        pluginId:            null,
        controls:            v.controls || [],
        cciRefs:             v.cciRefs  || [],
        createdAt:           today(),
        autoCreated:         true,
        // Exact STIG content fields
        title:               v.title,
        weaknessDesc:        v.description || "",
        remediation:         v.remediation || "Refer to STIG guidance.",
        responsible:         sys?.owner || "",
        resources:           "",
        scheduledCompletion: due.toISOString().split("T")[0],
        status:              "Open",
        poamType:            "Technical Finding — STIG",
        milestones,
        comments:            [
          v.findingDetails ? ("Finding Details:\n" + v.findingDetails) : "",
          v.comments       ? ("Reviewer Comments:\n" + v.comments)     : "",
          v.stigTitle      ? ("STIG: " + v.stigTitle)                  : "",
        ].filter(Boolean).join("\n\n"),
      };

      autoPoams.push(poam);
      return { ...v, poamId };
    });

    setVulnerabilities(p => [...p, ...vulnsWithPoamIds]);
    if (autoPoams.length > 0) setPoams(p => [...p, ...autoPoams]);
    setShowIngest(false);
    setCklPreview(null);
    setCklFileName("");
    setIngestSystemId("");
  };

  const ingest = () => {
    if (!ingestText.trim() || !ingestSystemId) return;
    const parsed = ingestType === "acas" ? parseAcasCsv(ingestText) : parseStigCsv(ingestText);
    const withSystem = parsed.map(v => ({ ...v, systemId: ingestSystemId }));
    setVulnerabilities(p => [...p, ...withSystem]);
    setShowIngest(false);
    setIngestText("");
  };

  const addManual = () => {
    if (!manualForm.title) return;
    const idKey = manualForm.source === "STIG" ? "stig" : "acas";
    const lookupId = manualForm.source === "STIG" ? manualForm.stigId : manualForm.pluginId;
    const controls = mapToControls(idKey, lookupId);
    setVulnerabilities(p => [...p, { ...manualForm, id: uid(), controls, dateFound: today(), poamId: null }]);
    setShowManual(false);
    setManualForm({ title: "", severity: "High", source: "STIG", stigId: "", pluginId: "", description: "", remediation: "", systemId: "", status: "Open" });
  };

  const [poamVuln, setPoamVuln] = useState(null);
  const [poamForm, setPoamForm] = useState({});
  const pf = (k) => (v) => setPoamForm(p => ({ ...p, [k]: v }));

  const openPoamModal = (vuln) => {
    const sys = systems.find(s => s.id === vuln.systemId);
    const daysOut = { Critical: 30, High: 30, Medium: 90, Low: 180, Info: 180 }[vuln.severity] || 90;
    const due = new Date(); due.setDate(due.getDate() + daysOut);
    setPoamForm({
      title: vuln.title || "",
      weaknessDesc: vuln.description || "",
      remediation: vuln.remediation || "",
      responsible: sys?.owner || "",
      resources: "",
      scheduledCompletion: due.toISOString().split("T")[0],
      status: "Open",
      poamType: vuln.source === "STIG" ? "Technical Finding" : "Vulnerability",
      milestones: "1. Assign remediation owner\n2. Develop remediation plan\n3. Implement fix\n4. Validate and close",
      comments: vuln.findingDetails || vuln.comments || "",
    });
    setPoamVuln(vuln);
  };

  const confirmPoam = () => {
    if (!poamForm.title) return;
    const poam = {
      id: uid(),
      vulnId: poamVuln.id,
      systemId: poamVuln.systemId,
      severity: poamVuln.severity,
      source: poamVuln.source,
      stigId: poamVuln.stigId || null,
      pluginId: poamVuln.pluginId || null,
      controls: poamVuln.controls || [],
      cciRefs: poamVuln.cciRefs || [],
      createdAt: today(),
      ...poamForm,
    };
    setPoams(p => [...p, poam]);
    setVulnerabilities(p => p.map(v => v.id === poamVuln.id ? { ...v, poamId: poam.id } : v));
    setPoamVuln(null);
  };

  const updateStatus = (id, status) => setVulnerabilities(p => p.map(v => v.id === id ? { ...v, status } : v));

  const sampleAcas = `Plugin ID,Plugin Name,Description,Remediation,Severity\n10144,MS17-010,SMB Remote Code Execution,Apply KB4012212,Critical\n19506,SSH Version Detection,Weak SSH config,Disable SSH v1,Medium\n51192,SSL Certificate Issues,Expired certificate,Renew SSL cert,High`;
  const sampleStig = `STIG ID,Title,Description,Remediation\nV-220697,Password Policy,Password length minimum,Set min password length to 15,High\nV-220698,Account Lockout,Lockout not configured,Configure lockout to 3 attempts,Medium`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 22, margin: 0 }}>Vulnerabilities</h2>
          <p style={{ color: "#6b7a99", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>{filtered.length} findings shown</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="warning" onClick={() => setShowIngest(true)}>⬆ Ingest Scan</Btn>
          <Btn variant="secondary" onClick={() => setShowManual(true)}>＋ Add Manual</Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "System", key: "system", opts: [{ value: "all", label: "All Systems" }, ...systems.map(s => ({ value: s.id, label: s.name }))] },
          { label: "Severity", key: "severity", opts: ["all","Critical","High","Medium","Low","Info"] },
          { label: "Status", key: "status", opts: ["all","Open","In Progress","Closed","Risk Accepted","False Positive"] },
          { label: "Source", key: "source", opts: ["all","ACAS","STIG","Manual"] }
        ].map(({ label, key, opts }) => (
          <select key={key} value={filter[key]} onChange={e => setFilter(p => ({ ...p, [key]: e.target.value }))} style={{
            background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8,
            padding: "8px 12px", color: "#0a1628", fontFamily: "'DM Mono', monospace",
            fontSize: 12, cursor: "pointer"
          }}>
            {opts.map(o => typeof o === "string"
              ? <option key={o} value={o}>{o === "all" ? `All ${label}` : o}</option>
              : <option key={o.value} value={o.value}>{o.label}</option>
            )}
          </select>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 64, color: "#8a9ab8", borderRadius: 12, border: "1px dashed #c5d0de" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontFamily: "'DM Mono', monospace" }}>No vulnerabilities found. Ingest a scan or add manually.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map(vuln => {
          const sev = SEVERITY_COLORS[vuln.severity] || SEVERITY_COLORS.Info;
          const sys = systems.find(s => s.id === vuln.systemId);
          return (
            <div key={vuln.id} style={{
              background: "#ffffff", border: "1px solid #c5d0de",
              borderLeft: `4px solid ${sev.bg}`, borderRadius: 8, padding: 16,
              display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap"
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                  <Badge color={sev.badge || sev.bg} textColor={sev.text} small>{vuln.severity}</Badge>
                  <Badge color="#e8eef6" textColor="#3a4a6b" small>{vuln.source}</Badge>
                  {/* STIG fields in correct order matching STIG Viewer */}
                  {vuln.groupId  && <Badge color="#d0dff5" textColor="#1a3a7a" small>Group: {vuln.groupId}</Badge>}
                  {vuln.stigId   && <Badge color="#d0f0e0" textColor="#1a7a4a" small>STIG: {vuln.stigId}</Badge>}
                  {vuln.pluginId && <Badge color="#dce8f5" textColor="#1a5aaa" small>PID: {vuln.pluginId}</Badge>}
                  <span style={{ color: STATUS_COLORS[vuln.status] || "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>● {vuln.status}</span>
                </div>
                <div style={{ color: "#0a1628", fontSize: 14, fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>{vuln.title}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {sys && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>System: <span style={{ color: "#3a4a6b" }}>{sys.name}</span></span>}
                  {vuln.ruleId && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Rule: <span style={{ color: "#3a4a6b" }}>{vuln.ruleId}</span></span>}
                  {vuln.srgId  && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>SRG: <span style={{ color: "#3a4a6b" }}>{vuln.srgId}</span></span>}
                  <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Controls: <span style={{ color: "#8a6200" }}>{vuln.controls?.join(", ")}</span></span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={vuln.status} onChange={e => updateStatus(vuln.id, e.target.value)} style={{
                  background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 6,
                  padding: "6px 10px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 11
                }}>
                  {["Open","In Progress","Closed","Risk Accepted","False Positive"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Btn small variant="secondary" onClick={() => setSelected(vuln)}>Detail</Btn>
                {!vuln.poamId && <Btn small variant="warning" onClick={() => openPoamModal(vuln)}>📋 Create POAM</Btn>}
                {vuln.poamId && <Badge color="#d4f5e5" textColor="#1a7a4a" small>✓ POAM</Badge>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vulnerability Detail Modal */}
      {selected && (
        <Modal title="Vulnerability Detail" onClose={() => setSelected(null)}>
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge color={SEVERITY_COLORS[selected.severity]?.badge} textColor={SEVERITY_COLORS[selected.severity]?.text}>{selected.severity}</Badge>
              <Badge color="#e8eef6" textColor="#3a4a6b">{selected.source}</Badge>
              {selected.stigId   && <Badge color="#d0f0e0" textColor="#1a7a4a">STIG: {selected.stigId}</Badge>}
              {selected.groupId  && <Badge color="#d0dff5" textColor="#1a3a7a">Group: {selected.groupId}</Badge>}
              {selected.pluginId && <Badge color="#dce8f5" textColor="#1a5aaa">Plugin {selected.pluginId}</Badge>}
            </div>
            <div style={{ color: "#0a1628", fontSize: 18, fontFamily: "'Syne', sans-serif" }}>{selected.title}</div>

            {/* STIG Viewer–style identifier grid */}
            {selected.source === "STIG" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Group ID",  selected.groupId  || "—"],
                  ["Rule ID",   selected.ruleId   || "—"],
                  ["STIG ID",   selected.stigId   || "—"],
                  ["SRG ID",    selected.srgId    || "—"],
                  ["Severity",  selected.severity ? `CAT ${selected.severity === "High" ? "I" : selected.severity === "Medium" ? "II" : "III"} (${selected.severity})` : "—"],
                  ["Benchmark", selected.stigRef  || selected.stigTitle || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#f0f4f8", borderRadius: 7, padding: "9px 14px" }}>
                    <div style={{ color: "#6b7a99", fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 3 }}>{label.toUpperCase()}</div>
                    <div style={{ color: "#0a1628", fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 700, wordBreak: "break-all" }}>{value}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16 }}>
                <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>MAPPED CONTROLS</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {selected.controls?.map(c => <Badge key={c} color="#ccddf5" textColor="#1a4a8a">{c}</Badge>)}
                </div>
              </div>
              <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16 }}>
                <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>STATUS</div>
                <span style={{ color: STATUS_COLORS[selected.status] || "#3a4a6b", fontFamily: "'Syne', sans-serif", fontSize: 16 }}>● {selected.status}</span>
              </div>
            </div>
            {selected.cciRefs?.length > 0 && (
              <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16 }}>
                <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>CCI REFERENCES</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {selected.cciRefs.map(c => <Badge key={c} color="#d0dff5" textColor="#1a3a7a" small>{c}</Badge>)}
                </div>
              </div>
            )}
            {selected.stigTitle && (
              <div style={{ background: "#e8eef6", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>STIG BENCHMARK</div>
                <div style={{ color: "#3a4a6b", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{selected.stigRef || selected.stigTitle}</div>
              </div>
            )}
            <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16 }}>
              <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>DESCRIPTION</div>
              <p style={{ color: "#3a4a6b", fontSize: 13, fontFamily: "'DM Mono', monospace", margin: 0, lineHeight: 1.6 }}>{selected.description || "No description provided."}</p>
            </div>
            <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16 }}>
              <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>REMEDIATION</div>
              <p style={{ color: "#3a4a6b", fontSize: 13, fontFamily: "'DM Mono', monospace", margin: 0, lineHeight: 1.6 }}>{selected.remediation || "No remediation guidance provided."}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Ingest Modal */}
      {showIngest && (
        <Modal title="Ingest Scan Results" onClose={() => { setShowIngest(false); setCklPreview(null); setCklFileName(""); }} width={780}>

          {/* Source tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#e8eef6", borderRadius: 10, padding: 4 }}>
            {[
              { key: "ckl",  label: "📋 STIG .ckl File", desc: "STIG Viewer checklist" },
              { key: "acas", label: "🔍 ACAS / Nessus",  desc: "CSV scan export" },
              { key: "stig", label: "📄 STIG CSV",        desc: "Manual STIG CSV" },
            ].map(t => (
              <button key={t.key} onClick={() => { setIngestType(t.key); setCklPreview(null); setCklFileName(""); setIngestText(""); }} style={{
                flex: 1, background: ingestType === t.key ? "#ffffff" : "transparent",
                border: ingestType === t.key ? "1px solid #c5d0de" : "1px solid transparent",
                borderRadius: 8, padding: "10px 14px", cursor: "pointer",
                boxShadow: ingestType === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}>
                <div style={{ color: ingestType === t.key ? "#0a1628" : "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700 }}>{t.label}</div>
                <div style={{ color: "#8a9ab8", fontFamily: "'DM Mono', monospace", fontSize: 10, marginTop: 2 }}>{t.desc}</div>
              </button>
            ))}
          </div>

          <Select label="ASSIGN TO SYSTEM" value={ingestSystemId} onChange={setIngestSystemId}
            options={[{ value: "", label: "Select a system..." }, ...systems.map(s => ({ value: s.id, label: s.name }))]} />

          {/* ── CKL FILE UPLOAD ── */}
          {ingestType === "ckl" && (
            <div>
              {/* Drop zone */}
              {(!cklPreview || cklPreview.length === 0) && !cklParseError && (
                <div
                  onDrop={handleCklDrop}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    border: "2px dashed #c5d0de", borderRadius: 12, padding: 40,
                    textAlign: "center", background: "#f7faff", marginBottom: 16,
                    transition: "border-color 0.2s, background 0.2s"
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                  <div style={{ color: "#1a3a7a", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                    Drop your .ckl file here
                  </div>
                  <div style={{ color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 20 }}>
                    STIG Viewer checklist files (.ckl) exported from DISA STIG Viewer
                  </div>
                  <label style={{
                    background: "#1a3a7a", color: "#fff", borderRadius: 8,
                    padding: "10px 24px", cursor: "pointer",
                    fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700,
                    letterSpacing: 0.5, display: "inline-block"
                  }}>
                    Browse for .ckl file
                    <input type="file" accept=".ckl,.xml" style={{ display: "none" }}
                      onChange={e => handleCklFile(e.target.files[0])} />
                  </label>
                  {cklFileName && (
                    <div style={{ marginTop: 12, color: "#1a7a4a", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                      ✓ {cklFileName}
                    </div>
                  )}
                  <div style={{ marginTop: 20, color: "#8a9ab8", fontSize: 11, fontFamily: "'DM Mono', monospace' " }}>
                    Findings are automatically mapped to NIST 800-53 controls via CCI references and STIG IDs
                  </div>
                </div>
              )}

              {/* Error shown even when no preview */}
              {cklParseError && !cklPreview?.length && (
                <div style={{ background: "#ffe0e0", border: "1px solid #cc2222", borderRadius: 8, padding: "12px 16px", marginBottom: 12, color: "#cc2222", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                  ⚠ {cklParseError}
                </div>
              )}

              {/* CKL Preview */}
              {cklPreview && cklPreview.length > 0 && (
                <div>
                  {/* Summary bar */}
                  <div style={{ background: "#f0f7ff", border: "1px solid #c0d4f0", borderRadius: 10, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>📋</span>
                      <div>
                        <div style={{ color: "#1a3a7a", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700 }}>{cklFileName}</div>
                        <div style={{ color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
                          {cklPreview[0]?.stigTitle || "STIG Checklist"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[
                        { label: "TOTAL", value: cklPreview.length, color: "#1a3a7a" },
                        { label: "OPEN", value: cklPreview.filter(f => f.status === "Open").length, color: "#cc2222" },
                        { label: "HIGH", value: cklPreview.filter(f => f.severity === "High" || f.severity === "Critical").length, color: "#c45200" },
                        { label: "MEDIUM", value: cklPreview.filter(f => f.severity === "Medium").length, color: "#a07800" },
                        { label: "LOW", value: cklPreview.filter(f => f.severity === "Low").length, color: "#1a7a4a" },
                        { label: "CLOSED", value: cklPreview.filter(f => f.status === "Closed").length, color: "#6b7a99" },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                          <div style={{ color: s.color, fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 900 }}>{s.value}</div>
                          <div style={{ color: "#8a9ab8", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <span style={{ color: "#1a7a4a", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, marginLeft: "auto" }}>
                      ⚡ {cklPreview.filter(v => v.status === "Open" || v.status === "In Progress").length} POAMs will be auto-created for Open findings
                    </span>
                    <button onClick={() => { setCklPreview(null); setCklFileName(""); }} style={{ background: "none", border: "1px solid #c5d0de", borderRadius: 6, padding: "4px 12px", color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer" }}>
                      ← Change file
                    </button>
                  </div>

                  {/* Parse error */}
                  {cklParseError && (
                    <div style={{ background: "#ffe0e0", border: "1px solid #cc2222", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#cc2222", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                      ⚠ {cklParseError}
                    </div>
                  )}

                  {/* Control coverage summary */}
                  {cklPreview.length > 0 && (() => {
                    const allControls = [...new Set(cklPreview.flatMap(f => f.controls || []))].sort();
                    const allCCIs     = [...new Set(cklPreview.flatMap(f => f.cciRefs || []))];
                    const cciMapped   = cklPreview.filter(f => f.cciRefs?.length > 0).length;
                    return (
                      <div style={{ background: "#fff8e8", border: "1px solid #e8c840", borderRadius: 8, padding: "10px 16px", marginBottom: 12 }}>
                        <div style={{ color: "#6b4e00", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
                          NIST 800-53 CONTROL MAPPING PREVIEW — {allControls.length} controls from {cciMapped} CCI-mapped findings
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {allControls.map(c => (
                            <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "2px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>
                          ))}
                        </div>
                        <div style={{ color: "#8a7040", fontSize: 10, fontFamily: "'DM Mono', monospace", marginTop: 6 }}>
                          {allCCIs.length} unique CCIs · {cklPreview.filter(f => f.status === "Open").length} open findings will drive Non-Compliant status in Controls module
                        </div>
                      </div>
                    );
                  })()}

                  {/* Finding preview table */}
                  <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid #e0e8f0", borderRadius: 8, marginBottom: 12 }}>
                    {cklPreview.slice(0, 50).map((f, i) => {
                      const sev = SEVERITY_COLORS[f.severity] || SEVERITY_COLORS.Info;
                      const sm = CTRL_STATUS_META[f.status] || CTRL_STATUS_META["Not Implemented"];
                      return (
                        <div key={f.id} style={{
                          display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px",
                          borderBottom: i < cklPreview.length - 1 ? "1px solid #f0f4f8" : "none",
                          background: i % 2 === 0 ? "#ffffff" : "#f7faff"
                        }}>
                          <span style={{ background: sev.badge || sev.bg, color: sev.text, borderRadius: 4, padding: "2px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{f.severity}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: "#0a1628", fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{f.stigId}</div>
                            <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</div>
                            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                              {f.controls.slice(0, 5).map(c => (
                                <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "1px 6px", fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>
                              ))}
                              {f.cciRefs?.length > 0 && (
                                <span style={{ background: "#e8eef6", color: "#6b7a99", borderRadius: 3, padding: "1px 6px", fontSize: 9, fontFamily: "'DM Mono', monospace" }}>
                                  {f.cciRefs.length} CCI{f.cciRefs.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                          <span style={{ color: sm.color, fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, flexShrink: 0, background: sm.bg, borderRadius: 4, padding: "2px 7px", marginTop: 2 }}>{sm.icon} {f.status}</span>
                        </div>
                      );
                    })}
                    {cklPreview.length > 50 && (
                      <div style={{ padding: "10px 14px", color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 11, textAlign: "center", background: "#f7faff" }}>
                        ... and {cklPreview.length - 50} more findings
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <Btn variant="secondary" onClick={() => setShowIngest(false)}>Cancel</Btn>
                    <Btn onClick={confirmCklIngest} disabled={!ingestSystemId}>
                      Import {cklPreview.length} Findings
                    </Btn>
                  </div>
                </div>
              )}

              {/* Waiting for file — no preview yet, show footer note */}
              {!cklPreview && (
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                  <Btn variant="secondary" onClick={() => setShowIngest(false)}>Cancel</Btn>
                </div>
              )}
            </div>
          )}

          {/* ── CSV INGEST (ACAS / STIG) ── */}
          {(ingestType === "acas" || ingestType === "stig") && (
            <div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", color: "#3a4a6b", fontSize: 12, marginBottom: 6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
                  CSV DATA{" "}
                  <span style={{ color: "#6b7a99" }}>
                    ({ingestType === "acas" ? "Plugin ID, Plugin Name, Description, Remediation, Severity" : "STIG ID, Title, Description, Remediation"})
                  </span>
                </label>
                <textarea value={ingestText} onChange={e => setIngestText(e.target.value)} rows={8} style={{
                  width: "100%", background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8,
                  padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace",
                  fontSize: 12, outline: "none", boxSizing: "border-box", resize: "vertical"
                }} placeholder={ingestType === "acas" ? sampleAcas : sampleStig} />
              </div>
              <p style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>
                Vulnerabilities will be automatically mapped to NIST 800-53 controls based on Plugin/STIG ID.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={() => setIngestText(ingestType === "acas" ? sampleAcas : sampleStig)}>Load Sample</Btn>
                <Btn variant="secondary" onClick={() => setShowIngest(false)}>Cancel</Btn>
                <Btn onClick={ingest} disabled={!ingestText.trim() || !ingestSystemId}>Ingest</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ── POAM Creation Modal ── */}
      {poamVuln && (
        <Modal title="Create Plan of Action & Milestones" onClose={() => setPoamVuln(null)} width={760}>
          {/* Finding summary banner */}
          <div style={{ background: "#f0f7ff", border: "1px solid #c0d4f0", borderRadius: 10, padding: "14px 18px", marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {(() => { const sev = SEVERITY_COLORS[poamVuln.severity] || SEVERITY_COLORS.Info; return <Badge color={sev.badge||sev.bg} textColor={sev.text} small>{poamVuln.severity}</Badge>; })()}
              <Badge color="#e8eef6" textColor="#3a4a6b" small>{poamVuln.source}</Badge>
              {poamVuln.stigId && <Badge color="#d0f0e0" textColor="#1a7a4a" small>{poamVuln.stigId}</Badge>}
              {poamVuln.pluginId && <Badge color="#dce8f5" textColor="#1a5aaa" small>PID {poamVuln.pluginId}</Badge>}
              {(poamVuln.cciRefs || []).slice(0,3).map(c => <Badge key={c} color="#d0dff5" textColor="#1a3a7a" small>{c}</Badge>)}
              {(poamVuln.cciRefs||[]).length > 3 && <Badge color="#e8eef6" textColor="#6b7a99" small>+{poamVuln.cciRefs.length-3} CCIs</Badge>}
            </div>
            <div style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{poamVuln.title}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(poamVuln.controls||[]).map(c => <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "1px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Title */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>POAM TITLE *</label>
              <input value={poamForm.title||""} onChange={e => pf("title")(e.target.value)} style={{ width: "100%", background: "#fff", border: "2px solid #1a3a7a", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* POAM Type */}
            <Select label="POAM TYPE" value={poamForm.poamType||"Technical Finding"} onChange={pf("poamType")}
              options={["Technical Finding","Operational Finding","Management Finding","Program Finding","Vulnerability"]} />

            {/* Status */}
            <Select label="STATUS" value={poamForm.status||"Open"} onChange={pf("status")}
              options={["Open","In Progress","Completed","Risk Accepted","False Positive"]} />

            {/* Responsible POC */}
            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>RESPONSIBLE POC</label>
              <input value={poamForm.responsible||""} onChange={e => pf("responsible")(e.target.value)} placeholder="Name / Organization" style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Scheduled Completion */}
            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>SCHEDULED COMPLETION *</label>
              <input type="date" value={poamForm.scheduledCompletion||""} onChange={e => pf("scheduledCompletion")(e.target.value)} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Resources */}
            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>RESOURCES REQUIRED</label>
              <input value={poamForm.resources||""} onChange={e => pf("resources")(e.target.value)} placeholder="e.g. $5,000 / 40 staff hours" style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* Weakness Description */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>WEAKNESS / FINDING DESCRIPTION</label>
              <textarea value={poamForm.weaknessDesc||""} onChange={e => pf("weaknessDesc")(e.target.value)} rows={3} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>

            {/* Remediation / Corrective Action */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>CORRECTIVE ACTION / REMEDIATION PLAN</label>
              <textarea value={poamForm.remediation||""} onChange={e => pf("remediation")(e.target.value)} rows={3} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>

            {/* Milestones */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>MILESTONES WITH COMPLETION DATES</label>
              <textarea value={poamForm.milestones||""} onChange={e => pf("milestones")(e.target.value)} rows={4} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.8 }} />
            </div>

            {/* Comments */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>COMMENTS / NOTES</label>
              <textarea value={poamForm.comments||""} onChange={e => pf("comments")(e.target.value)} rows={2} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
          </div>

          {/* Controls / CCI read-only strip */}
          <div style={{ background: "#f7faff", border: "1px solid #e0e8f0", borderRadius: 8, padding: "12px 16px", marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>NIST 800-53 CONTROLS</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(poamVuln.controls||[]).map(c => <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "2px 8px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
              </div>
            </div>
            {(poamVuln.cciRefs||[]).length > 0 && (
              <div>
                <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>CCI REFERENCES</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(poamVuln.cciRefs||[]).map(c => <span key={c} style={{ background: "#e8eef6", color: "#3a4a6b", borderRadius: 3, padding: "2px 8px", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{c}</span>)}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
            <Btn variant="secondary" onClick={() => setPoamVuln(null)}>Cancel</Btn>
            <Btn onClick={confirmPoam} disabled={!poamForm.title}>📋 Save POAM</Btn>
          </div>
        </Modal>
      )}

      {/* Manual Add Modal */}
      {showManual && (
        <Modal title="Add Manual Finding" onClose={() => setShowManual(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="TITLE" value={manualForm.title} onChange={mf("title")} placeholder="Vulnerability title" required style={{ gridColumn: "1/-1" }} />
            <Select label="SEVERITY" value={manualForm.severity} onChange={mf("severity")} options={["Critical","High","Medium","Low","Info"]} />
            <Select label="SOURCE" value={manualForm.source} onChange={mf("source")} options={["STIG","ACAS","Manual"]} />
            {manualForm.source === "STIG" && <Input label="STIG ID" value={manualForm.stigId} onChange={mf("stigId")} placeholder="e.g. V-220697" />}
            {manualForm.source === "ACAS" && <Input label="PLUGIN ID" value={manualForm.pluginId} onChange={mf("pluginId")} placeholder="e.g. 19506" />}
            <Select label="SYSTEM" value={manualForm.systemId} onChange={mf("systemId")}
              options={[{ value: "", label: "Select system..." }, ...systems.map(s => ({ value: s.id, label: s.name }))]} />
          </div>
          <Textarea label="DESCRIPTION" value={manualForm.description} onChange={mf("description")} rows={3} />
          <Textarea label="REMEDIATION" value={manualForm.remediation} onChange={mf("remediation")} rows={3} />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowManual(false)}>Cancel</Btn>
            <Btn onClick={addManual} disabled={!manualForm.title}>Add Finding</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── POAMs View ────────────────────────────────────────────────────────────
function PoamsView({ poams, setPoams, systems }) {
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const ef = (k) => (v) => setEditForm(p => ({ ...p, [k]: v }));

  const openEdit = (p) => { setEditing(p.id); setEditForm({ ...p }); };
  const saveEdit = () => {
    setPoams(p => p.map(x => x.id === editing ? { ...editForm } : x));
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 22, margin: 0 }}>Plan of Action & Milestones</h2>
          <p style={{ color: "#6b7a99", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>{poams.length} POAMs — Create from Vulnerabilities tab</p>
        </div>
      </div>

      {poams.length === 0 && (
        <div style={{ textAlign: "center", padding: 64, color: "#8a9ab8", borderRadius: 12, border: "1px dashed #c5d0de" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontFamily: "'DM Mono', monospace" }}>No POAMs yet. POAMs are created automatically when a CKL is ingested with open findings. You can also create them manually from the Vulnerabilities tab using the → POAM button.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {poams.map(poam => {
          const sys = systems.find(s => s.id === poam.systemId);
          const sev = SEVERITY_COLORS[poam.severity] || SEVERITY_COLORS.Info;
          const isOverdue = poam.scheduledCompletion && poam.status !== "Completed" && new Date(poam.scheduledCompletion) < new Date();
          return (
            <div key={poam.id} style={{ background: "#ffffff", border: `1px solid ${isOverdue ? "#cc2222" : "#c5d0de"}`, borderLeft: `4px solid ${sev.bg}`, borderRadius: 10, overflow: "hidden" }}>
              {/* Header row */}
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace", background: "#e8eef6", borderRadius: 4, padding: "2px 7px" }}>POAM-{poam.id.slice(0,6)}</span>
                    <Badge color={sev.badge||sev.bg} textColor={sev.text} small>{poam.severity}</Badge>
                    <Badge color="#e8eef6" textColor="#3a4a6b" small>{poam.source}</Badge>
                    {poam.poamType && <Badge color="#d0dff5" textColor="#1a3a7a" small>{poam.poamType}</Badge>}
                    {poam.autoCreated && <Badge color="#d4f5e5" textColor="#1a7a4a" small>⚡ Auto-Generated</Badge>}
                    <span style={{ color: STATUS_COLORS[poam.status] || "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>● {poam.status}</span>
                    {isOverdue && <span style={{ color: "#cc2222", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, background: "#ffe0e0", borderRadius: 4, padding: "2px 7px" }}>⚠ OVERDUE</span>}
                  </div>
                  <div style={{ color: "#0a1628", fontSize: 15, fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 10 }}>{poam.title}</div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {sys && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>System: <span style={{ color: "#0a1628", fontWeight: 700 }}>{sys.name}</span></span>}
                    {poam.groupId && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Group ID: <span style={{ color: "#1a3a7a", fontWeight: 700 }}>{poam.groupId}</span></span>}
                    {poam.stigId  && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>STIG ID: <span style={{ color: "#1a7a4a", fontWeight: 700 }}>{poam.stigId}</span></span>}
                    {poam.ruleId  && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Rule ID: <span style={{ color: "#3a4a6b" }}>{poam.ruleId}</span></span>}
                    {poam.srgId   && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>SRG: <span style={{ color: "#3a4a6b" }}>{poam.srgId}</span></span>}
                    {poam.responsible && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>POC: <span style={{ color: "#3a4a6b" }}>{poam.responsible}</span></span>}
                    {poam.scheduledCompletion && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Due: <span style={{ color: isOverdue ? "#cc2222" : "#c45200", fontWeight: 700 }}>{poam.scheduledCompletion}</span></span>}
                    {poam.resources && <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Resources: <span style={{ color: "#3a4a6b" }}>{poam.resources}</span></span>}
                    <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Created: <span style={{ color: "#3a4a6b" }}>{poam.createdAt}</span></span>
                  </div>
                  {/* Controls + CCIs */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                    {(poam.controls||[]).map(c => <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "1px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
                    {(poam.cciRefs||[]).slice(0,4).map(c => <span key={c} style={{ background: "#e8eef6", color: "#6b7a99", borderRadius: 3, padding: "1px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{c}</span>)}
                    {(poam.cciRefs||[]).length > 4 && <span style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>+{poam.cciRefs.length-4} CCIs</span>}
                  </div>
                </div>
                <Btn small variant="secondary" onClick={() => openEdit(poam)}>✎ Edit</Btn>
              </div>
              {/* Body rows: weakness, remediation, milestones */}
              {(poam.weaknessDesc || poam.remediation || poam.milestones) && (
                <div style={{ borderTop: "1px solid #e8eef6", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
                  {poam.weaknessDesc && (
                    <div style={{ padding: "12px 18px", borderRight: "1px solid #e8eef6" }}>
                      <div style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>WEAKNESS</div>
                      <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", lineHeight: 1.6, maxHeight: 80, overflow: "hidden" }}>{poam.weaknessDesc}</div>
                    </div>
                  )}
                  {poam.remediation && (
                    <div style={{ padding: "12px 18px", borderRight: "1px solid #e8eef6" }}>
                      <div style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>CORRECTIVE ACTION</div>
                      <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", lineHeight: 1.6, maxHeight: 80, overflow: "hidden" }}>{poam.remediation}</div>
                    </div>
                  )}
                  {poam.milestones && (
                    <div style={{ padding: "12px 18px" }}>
                      <div style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>MILESTONES</div>
                      <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", lineHeight: 1.8, maxHeight: 80, overflow: "hidden", whiteSpace: "pre-line" }}>{poam.milestones}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal title="Edit POAM" onClose={() => setEditing(null)} width={720}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="STATUS" value={editForm.status||"Open"} onChange={ef("status")} options={["Open","In Progress","Completed","Risk Accepted","False Positive"]} />
            <Input label="SCHEDULED COMPLETION" value={editForm.scheduledCompletion||""} onChange={ef("scheduledCompletion")} type="date" />
            <Input label="RESPONSIBLE POC" value={editForm.responsible||""} onChange={ef("responsible")} placeholder="Person / Org responsible" />
            <Input label="RESOURCES REQUIRED" value={editForm.resources||""} onChange={ef("resources")} placeholder="Budget, tools, personnel..." />
          </div>
          <Textarea label="WEAKNESS / FINDING DESCRIPTION" value={editForm.weaknessDesc||""} onChange={ef("weaknessDesc")} rows={3} />
          <Textarea label="CORRECTIVE ACTION / REMEDIATION PLAN" value={editForm.remediation||""} onChange={ef("remediation")} rows={3} />
          <Textarea label="MILESTONES" value={editForm.milestones||""} onChange={ef("milestones")} placeholder="1. Patch by Q2&#10;2. Re-scan to verify&#10;3. Close POAM" rows={4} />
          <Textarea label="COMMENTS" value={editForm.comments||""} onChange={ef("comments")} rows={2} placeholder="Additional context or notes..." />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn variant="success" onClick={saveEdit}>Save POAM</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SAR View ──────────────────────────────────────────────────────────────
function SarView({ systems, vulnerabilities, poams, defaultSystemId }) {
  const [selectedSystem, setSelectedSystem] = useState(defaultSystemId || "");
  useEffect(() => { if (defaultSystemId) setSelectedSystem(defaultSystemId); }, [defaultSystemId]);
  const [sarForm, setSarForm] = useState({ assessorName: "", assessorOrg: "", assessmentDate: today(), methodology: "Hybrid", findings: "", recommendations: "", overallRisk: "Moderate" });
  const sf = (k) => (v) => setSarForm(p => ({ ...p, [k]: v }));
  const [generated, setGenerated] = useState(null);

  const generate = () => {
    const sys = systems.find(s => s.id === selectedSystem);
    if (!sys) return;
    const sysVulns = vulnerabilities.filter(v => v.systemId === selectedSystem);
    const sysPoams = poams.filter(p => p.systemId === selectedSystem);
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 };
    sysVulns.forEach(v => { counts[v.severity] = (counts[v.severity] || 0) + 1; });
    const controls = [...new Set(sysVulns.flatMap(v => v.controls || []))];
    setGenerated({ sys, sysVulns, sysPoams, counts, controls, ...sarForm, generatedAt: new Date().toLocaleString() });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 22, margin: 0 }}>Security Assessment Report</h2>
        <p style={{ color: "#6b7a99", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>Generate SAR per system per NIST SP 800-53A</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
        <div style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 24, height: "fit-content" }}>
          <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 20, marginTop: 0 }}>SAR PARAMETERS</h3>
          <Select label="SYSTEM" value={selectedSystem} onChange={setSelectedSystem}
            options={[{ value: "", label: "Select system..." }, ...systems.map(s => ({ value: s.id, label: s.name }))]} />
          <Input label="ASSESSOR NAME" value={sarForm.assessorName} onChange={sf("assessorName")} placeholder="e.g. Jane Doe" />
          <Input label="ASSESSOR ORGANIZATION" value={sarForm.assessorOrg} onChange={sf("assessorOrg")} placeholder="e.g. Acme Security LLC" />
          <Input label="ASSESSMENT DATE" value={sarForm.assessmentDate} onChange={sf("assessmentDate")} type="date" />
          <Select label="METHODOLOGY" value={sarForm.methodology} onChange={sf("methodology")} options={["Interview","Examination","Testing","Hybrid"]} />
          <Select label="OVERALL RISK" value={sarForm.overallRisk} onChange={sf("overallRisk")} options={["Very Low","Low","Moderate","High","Very High"]} />
          <Textarea label="ADDITIONAL FINDINGS" value={sarForm.findings} onChange={sf("findings")} rows={3} />
          <Textarea label="RECOMMENDATIONS" value={sarForm.recommendations} onChange={sf("recommendations")} rows={3} />
          <Btn onClick={generate} disabled={!selectedSystem} style={{ width: "100%", textAlign: "center" }}>Generate SAR</Btn>
        </div>

        <div>
          {!generated && (
            <div style={{ textAlign: "center", padding: 80, color: "#8a9ab8", borderRadius: 12, border: "1px dashed #c5d0de" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <p style={{ fontFamily: "'DM Mono', monospace" }}>Configure parameters and click Generate SAR</p>
            </div>
          )}
          {generated && (
            <div style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 32 }}>
              {/* SAR Header */}
              <div style={{ borderBottom: "2px solid #1a3a7a", paddingBottom: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 8 }}>SECURITY ASSESSMENT REPORT</div>
                    <h1 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 26, margin: 0 }}>{generated.sys.name}</h1>
                    <p style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, margin: "8px 0 0" }}>
                      NIST SP 800-53A Rev 5 Assessment | {generated.sys.classification} | {generated.sys.impact} Impact
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge color={generated.overallRisk === "High" || generated.overallRisk === "Very High" ? "#cc2222" : generated.overallRisk === "Moderate" ? "#a07800" : "#1a7a4a"} textColor="#fff">{generated.overallRisk} Risk</Badge>
                    <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 8 }}>{generated.generatedAt}</div>
                  </div>
                </div>
              </div>

              {/* Assessment Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  ["Assessor", generated.assessorName || "—"],
                  ["Organization", generated.assessorOrg || "—"],
                  ["Assessment Date", generated.assessmentDate],
                  ["Methodology", generated.methodology],
                  ["System Owner", generated.sys.owner || "—"],
                  ["ATO Date", generated.sys.atoDate || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#e8eef6", borderRadius: 8, padding: 14 }}>
                    <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                    <div style={{ color: "#0a1628", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Vuln Summary */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>VULNERABILITY SUMMARY</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {Object.entries(generated.counts).filter(([,v]) => v > 0).map(([sev, count]) => {
                    const c = SEVERITY_COLORS[sev];
                    return (
                      <div key={sev} style={{ background: "#e8eef6", borderRadius: 10, padding: "14px 20px", textAlign: "center", borderTop: `3px solid ${c.bg}` }}>
                        <div style={{ color: c.bg, fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{count}</div>
                        <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{sev.toUpperCase()}</div>
                      </div>
                    );
                  })}
                  <div style={{ background: "#e8eef6", borderRadius: 10, padding: "14px 20px", textAlign: "center", borderTop: "3px solid #1a3a7a" }}>
                    <div style={{ color: "#1a5aaa", fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{generated.sysVulns.length}</div>
                    <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>TOTAL</div>
                  </div>
                  <div style={{ background: "#e8eef6", borderRadius: 10, padding: "14px 20px", textAlign: "center", borderTop: "3px solid #8a6200" }}>
                    <div style={{ color: "#8a6200", fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{generated.sysPoams.length}</div>
                    <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>POAMs</div>
                  </div>
                </div>
              </div>

              {/* Controls Assessed */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>CONTROLS ASSESSED ({generated.controls.length})</h3>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {generated.controls.map(c => <Badge key={c} color="#ccddf5" textColor="#1a4a8a">{c}</Badge>)}
                </div>
              </div>

              {/* Findings */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>DETAILED FINDINGS</h3>
                {generated.sysVulns.slice(0, 10).map((v, i) => {
                  const sev = SEVERITY_COLORS[v.severity] || SEVERITY_COLORS.Info;
                  return (
                    <div key={v.id} style={{ borderLeft: `3px solid ${sev.bg}`, paddingLeft: 16, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #e8eef6" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{i + 1}.</span>
                        <Badge color={sev.badge || sev.bg} textColor={sev.text} small>{v.severity}</Badge>
                        {v.controls?.map(c => <Badge key={c} color="#e8eef6" textColor="#3a4a6b" small>{c}</Badge>)}
                      </div>
                      <div style={{ color: "#0a1628", fontSize: 14, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{v.title}</div>
                      <div style={{ color: "#6b7a99", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{v.description}</div>
                    </div>
                  );
                })}
                {generated.sysVulns.length > 10 && <div style={{ color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>... and {generated.sysVulns.length - 10} more findings</div>}
              </div>

              {/* Recommendations */}
              {generated.recommendations && (
                <div style={{ background: "#d8f0e5", border: "1px solid #c8ecd8", borderRadius: 8, padding: 20, marginBottom: 24 }}>
                  <h3 style={{ color: "#1a7a4a", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>RECOMMENDATIONS</h3>
                  <p style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.8, margin: 0 }}>{generated.recommendations}</p>
                </div>
              )}

              <div style={{ borderTop: "1px solid #c5d0de", paddingTop: 16, color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
                This report was generated in accordance with NIST SP 800-53A Rev 5. All findings require ISSO/ISSM review.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Risk Assessment Report (RAR) ─────────────────────────────────────────
// Per NIST SP 800-30 Rev 1

const THREAT_SOURCES = [
  { id:"TS-1",  type:"Adversarial",    name:"Nation-State Actors",         desc:"Highly capable state-sponsored threat actors" },
  { id:"TS-2",  type:"Adversarial",    name:"Criminal Organizations",      desc:"Organized crime seeking financial gain" },
  { id:"TS-3",  type:"Adversarial",    name:"Insider Threat (Malicious)",  desc:"Authorized users acting with malicious intent" },
  { id:"TS-4",  type:"Adversarial",    name:"Hacktivist Groups",           desc:"Ideologically motivated external attackers" },
  { id:"TS-5",  type:"Adversarial",    name:"Competitors",                 desc:"Corporate espionage actors" },
  { id:"TS-6",  type:"Non-Adversarial",name:"Insider Threat (Negligent)",  desc:"Unintentional errors by authorized personnel" },
  { id:"TS-7",  type:"Non-Adversarial",name:"Third-Party / Supply Chain",  desc:"Vulnerabilities introduced by vendors or partners" },
  { id:"TS-8",  type:"Environmental",  name:"Natural Disaster",            desc:"Flood, fire, earthquake, severe weather" },
  { id:"TS-9",  type:"Environmental",  name:"Infrastructure Failure",      desc:"Power outage, HVAC, hardware failure" },
  { id:"TS-10", type:"Structural",     name:"Software Defects",            desc:"Bugs, misconfigurations, zero-days" },
];

const THREAT_EVENTS = [
  { id:"TE-1",  name:"Unauthorized Access",            category:"Exploit",    relevantSources:["TS-1","TS-2","TS-3"] },
  { id:"TE-2",  name:"Data Exfiltration",              category:"Exploit",    relevantSources:["TS-1","TS-2","TS-3","TS-5"] },
  { id:"TE-3",  name:"Denial of Service",              category:"Disrupt",    relevantSources:["TS-1","TS-2","TS-4"] },
  { id:"TE-4",  name:"Malware / Ransomware",           category:"Exploit",    relevantSources:["TS-1","TS-2"] },
  { id:"TE-5",  name:"Phishing / Social Engineering",  category:"Deceive",    relevantSources:["TS-1","TS-2","TS-4"] },
  { id:"TE-6",  name:"Privilege Escalation",           category:"Exploit",    relevantSources:["TS-1","TS-2","TS-3"] },
  { id:"TE-7",  name:"Supply Chain Compromise",        category:"Exploit",    relevantSources:["TS-7"] },
  { id:"TE-8",  name:"Physical Intrusion",             category:"Exploit",    relevantSources:["TS-1","TS-3"] },
  { id:"TE-9",  name:"Configuration Error / Misconfiguration", category:"Error", relevantSources:["TS-6"] },
  { id:"TE-10", name:"Data Destruction / Integrity Attack", category:"Destroy", relevantSources:["TS-1","TS-2","TS-3","TS-4"] },
  { id:"TE-11", name:"Man-in-the-Middle / Eavesdropping", category:"Exploit", relevantSources:["TS-1","TS-2"] },
  { id:"TE-12", name:"System / Service Outage",        category:"Disrupt",    relevantSources:["TS-8","TS-9"] },
];

const LIKELIHOOD_LEVELS = [
  { value:5, label:"Very High", color:"#cc2222", bg:"#ffe0e0", desc:"Near certainty of occurrence" },
  { value:4, label:"High",      color:"#c45200", bg:"#ffe8d0", desc:"Highly likely to occur" },
  { value:3, label:"Moderate",  color:"#a07800", bg:"#fff3c0", desc:"Somewhat likely to occur" },
  { value:2, label:"Low",       color:"#1a7a4a", bg:"#d4f5e5", desc:"Unlikely but possible" },
  { value:1, label:"Very Low",  color:"#1a6a9a", bg:"#d0e8f5", desc:"Highly unlikely" },
];

const IMPACT_LEVELS = [
  { value:5, label:"Very High", color:"#cc2222", bg:"#ffe0e0", desc:"Catastrophic / mission failure" },
  { value:4, label:"High",      color:"#c45200", bg:"#ffe8d0", desc:"Severe / major mission degradation" },
  { value:3, label:"Moderate",  color:"#a07800", bg:"#fff3c0", desc:"Significant / mission capability loss" },
  { value:2, label:"Low",       color:"#1a7a4a", bg:"#d4f5e5", desc:"Minor / limited impact" },
  { value:1, label:"Very Low",  color:"#1a6a9a", bg:"#d0e8f5", desc:"Negligible impact" },
];

// Risk = Likelihood × Impact → matrix cell label
function riskLevel(l, i) {
  const score = l * i;
  if (score >= 15) return { label:"Very High", color:"#cc2222", bg:"#ffe0e0" };
  if (score >= 9)  return { label:"High",      color:"#c45200", bg:"#ffe8d0" };
  if (score >= 5)  return { label:"Moderate",  color:"#a07800", bg:"#fff3c0" };
  if (score >= 2)  return { label:"Low",       color:"#1a7a4a", bg:"#d4f5e5" };
  return                   { label:"Very Low", color:"#1a6a9a", bg:"#d0e8f5" };
}


function RarView({ systems, vulnerabilities, poams, controlStatuses, defaultSystemId }) {
  const [selSys,      setSelSys]      = useState(defaultSystemId || "");
  useEffect(() => { if (defaultSystemId) setSelSys(defaultSystemId); }, [defaultSystemId]);
  const [rarMeta,     setRarMeta]     = useState({
    title:"", preparedBy:"", org:"", version:"1.0", date:today(),
    purpose:"", scope:"", assumptions:"", overallRisk:"Moderate",
    execSummary:"", methodology:"Hybrid"
  });
  const [risks,       setRisks]       = useState([]);
  const [showAdd,     setShowAdd]     = useState(false);
  const [editRisk,    setEditRisk]    = useState(null);
  const [viewMode,    setViewMode]    = useState("register");  // register | matrix | report
  const [riskForm,    setRiskForm]    = useState({});
  const [generated,   setGenerated]   = useState(null);
  const [showMeta,    setShowMeta]    = useState(true);

  const rf = k => v => setRiskForm(p => ({ ...p, [k]:v }));
  const mf = k => v => setRarMeta(p => ({ ...p, [k]:v }));

  const sys = systems.find(s => s.id === selSys);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const riskColors = { "Very High":"#cc2222", "High":"#c45200", "Moderate":"#a07800", "Low":"#1a7a4a", "Very Low":"#1a6a9a" };
  const riskBgs    = { "Very High":"#ffe0e0", "High":"#ffe8d0", "Moderate":"#fff3c0", "Low":"#d4f5e5", "Very Low":"#d0e8f5" };

  const LevelPill = ({ l, i }) => {
    const rl = riskLevel(l, i);
    return (
      <span style={{ background:rl.bg, color:rl.color, border:`1px solid ${rl.color}`,
        borderRadius:12, padding:"2px 10px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>
        {rl.label}
      </span>
    );
  };

  const LevelSelector = ({ label, value, onChange, levels }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace",
        letterSpacing:1, marginBottom:8 }}>{label}</label>
      <div style={{ display:"flex", gap:6 }}>
        {levels.map(lvl => (
          <button key={lvl.value} onClick={() => onChange(lvl.value)} style={{
            flex:1, background:value===lvl.value ? lvl.bg : "#e8eef6",
            border:`2px solid ${value===lvl.value ? lvl.color : "#c5d0de"}`,
            borderRadius:7, padding:"7px 4px", cursor:"pointer", transition:"all 0.15s"
          }}>
            <div style={{ color:value===lvl.value ? lvl.color : "#8a9ab8",
              fontFamily:"'DM Mono', monospace", fontSize:10, fontWeight:700 }}>{lvl.label}</div>
            <div style={{ color:value===lvl.value ? lvl.color : "#aab8cc",
              fontFamily:"'DM Mono', monospace", fontSize:8, marginTop:1 }}>{lvl.value}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Risk stats ─────────────────────────────────────────────────────────────
  const byLevel = { "Very High":0, "High":0, "Moderate":0, "Low":0, "Very Low":0 };
  risks.forEach(r => {
    const lvl = riskLevel(r.likelihood, r.impact).label;
    byLevel[lvl] = (byLevel[lvl]||0)+1;
  });
  const highPlusCount = (byLevel["Very High"]||0) + (byLevel["High"]||0);

  // ── Auto-generate from findings ────────────────────────────────────────────
  const autoGenerate = () => {
    if (!selSys) return;
    const sysVulns = vulnerabilities.filter(v => v.systemId === selSys && v.status === "Open");
    const sevToL = { Critical:5, High:4, Medium:3, Low:2, Info:1 };
    const generated = sysVulns.slice(0, 25).map(v => {
      const l = sevToL[v.severity] || 3;
      const i = sevToL[v.severity] || 3;
      return {
        id: uid(), vulnId: v.id,
        title: v.title,
        desc: v.description || "",
        threatSource: v.source === "STIG" ? "TS-10" : "TS-2",
        threatEvent: ["Critical","High"].includes(v.severity) ? "TE-1" : "TE-9",
        controls: v.controls || [],
        likelihood: l, impact: i,
        currentControls: (v.controls||[]).join(", "),
        recommendation: v.remediation || "",
        status: "Open",
        residualLikelihood: Math.max(1, l-1),
        residualImpact: Math.max(1, i-1),
        stigId: v.stigId || "",
        cciRefs: v.cciRefs || [],
      };
    });
    setRisks(p => {
      const existIds = new Set(p.map(r => r.vulnId).filter(Boolean));
      return [...p, ...generated.filter(g => !existIds.has(g.vulnId))];
    });
  };

  const openAdd = () => {
    setRiskForm({ title:"", desc:"", threatSource:"TS-1", threatEvent:"TE-1",
      likelihood:3, impact:3, residualLikelihood:2, residualImpact:2,
      currentControls:"", recommendation:"", status:"Open", controls:[] });
    setEditRisk(null); setShowAdd(true);
  };

  const openEdit = r => { setRiskForm({...r}); setEditRisk(r.id); setShowAdd(true); };

  const saveRisk = () => {
    if (!riskForm.title) return;
    if (editRisk) setRisks(p => p.map(r => r.id === editRisk ? { ...riskForm, id:editRisk } : r));
    else           setRisks(p => [...p, { ...riskForm, id:uid() }]);
    setShowAdd(false); setEditRisk(null);
  };

  const deleteRisk = id => setRisks(p => p.filter(r => r.id !== id));

  // ── Generate / lock report ─────────────────────────────────────────────────
  const generateReport = () => {
    if (!selSys || risks.length === 0) return;
    const snapshot = {
      meta: { ...rarMeta },
      sys: { ...sys },
      risks: risks.map((r, idx) => ({ ...r, riskNum: `R${String(idx+1).padStart(2,"0")}` })),
      byLevel: { ...byLevel },
      generatedAt: new Date().toLocaleString(),
      poamCount: poams.filter(p => p.systemId === selSys).length,
      openVulns: vulnerabilities.filter(v => v.systemId === selSys && v.status === "Open").length,
    };
    setGenerated(snapshot);
    setViewMode("report");
  };

  // ── Print handler ──────────────────────────────────────────────────────────
  const printReport = () => {
    const printArea = document.getElementById("rar-print-area");
    if (!printArea) return;
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <html><head>
        <title>${generated?.meta?.title || "Risk Assessment Report"}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500;700&display=swap">
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'DM Mono',monospace;color:#0a1628;background:#fff;padding:40px}
          h1{font-family:'Syne',sans-serif;font-size:28px;margin-bottom:8px}
          h2{font-family:'Syne',sans-serif;font-size:18px;color:#1a3a7a;border-bottom:2px solid #1a3a7a;padding-bottom:6px;margin:28px 0 14px}
          h3{font-family:'Syne',sans-serif;font-size:14px;margin:16px 0 8px}
          .label{font-size:9px;letter-spacing:1px;color:#6b7a99;margin-bottom:4px;text-transform:uppercase}
          .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
          .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
          .meta-cell{background:#e8eef6;border-radius:6px;padding:12px}
          .risk-card{border:1px solid #c5d0de;border-radius:8px;margin-bottom:14px;overflow:hidden}
          .risk-header{padding:10px 16px;font-family:'Syne',sans-serif;font-weight:900;font-size:14px}
          .risk-body{padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .risk-field{margin-bottom:0}
          .badge{display:inline-block;padding:2px 10px;border-radius:10px;font-size:10px;font-weight:700}
          .ctrl-badge{background:#d0dff5;color:#1a3a7a;border-radius:3px;padding:2px 7px;font-size:9px;font-weight:700;display:inline-block;margin:2px}
          .matrix-grid{display:grid;grid-template-columns:80px repeat(5,1fr);gap:2px;margin-bottom:20px}
          .matrix-cell{border-radius:4px;height:50px;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:9px;font-weight:700}
          .stat-box{background:#e8eef6;border-radius:8px;padding:12px 16px;text-align:center}
          .stat-num{font-family:'Syne',sans-serif;font-size:24px;font-weight:900}
          p{line-height:1.8;margin-bottom:12px;color:#3a4a6b;font-size:12px}
          .footer{border-top:1px solid #c5d0de;padding-top:14px;margin-top:28px;color:#8a9ab8;font-size:10px}
          @media print{body{padding:20px}@page{margin:15mm}}
        </style>
      </head><body>${printArea.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Top bar ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:22, margin:0 }}>
            Risk Assessment Report
          </h2>
          <p style={{ color:"#6b7a99", fontSize:13, margin:"4px 0 0", fontFamily:"'DM Mono', monospace" }}>
            NIST SP 800-30 Rev 1 — Guide for Conducting Risk Assessments
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[
            { id:"register", icon:"📋", label:"Risk Register" },
            { id:"matrix",   icon:"⊞", label:"Risk Matrix"   },
            { id:"report",   icon:"📄", label:"Full Report"   },
          ].map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)} style={{
              background: viewMode===m.id ? "#1a3a7a" : "#e8eef6",
              color: viewMode===m.id ? "#fff" : "#3a4a6b",
              border:"none", borderRadius:8, padding:"9px 18px",
              fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700, cursor:"pointer"
            }}>{m.icon} {m.label}</button>
          ))}
        </div>
      </div>

      {/* ── Configuration panel ── */}
      <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12,
        marginBottom:20, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"14px 20px", borderBottom: showMeta ? "1px solid #e8eef6" : "none",
          cursor:"pointer", background:"#f7faff" }}
          onClick={() => setShowMeta(p => !p)}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ color:"#1a3a7a", fontFamily:"'DM Mono', monospace", fontSize:11,
              fontWeight:700, letterSpacing:1 }}>⚙ ASSESSMENT CONFIGURATION</span>
            {sys && <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
              {sys.name} · {sys.classification} · {sys.impact} Impact
            </span>}
          </div>
          <span style={{ color:"#6b7a99", fontSize:14 }}>{showMeta ? "▲" : "▼"}</span>
        </div>

        {showMeta && (
          <div style={{ padding:20 }}>
            {/* Row 1 */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>SYSTEM *</label>
                <select value={selSys} onChange={e => setSelSys(e.target.value)} style={{
                  width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                  padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                  <option value="">— Select system —</option>
                  {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>PREPARED BY</label>
                <input value={rarMeta.preparedBy} onChange={e => mf("preparedBy")(e.target.value)}
                  placeholder="Analyst name"
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                    padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12,
                    outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>ORGANIZATION</label>
                <input value={rarMeta.org} onChange={e => mf("org")(e.target.value)}
                  placeholder="e.g. DISA"
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                    padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12,
                    outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>DATE</label>
                <input type="date" value={rarMeta.date} onChange={e => mf("date")(e.target.value)} style={{
                  width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                  padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12,
                  outline:"none", boxSizing:"border-box" }} />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>RAR TITLE</label>
                <input value={rarMeta.title} onChange={e => mf("title")(e.target.value)}
                  placeholder="e.g. FY2025 Annual Risk Assessment"
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                    padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12,
                    outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>VERSION</label>
                <input value={rarMeta.version} onChange={e => mf("version")(e.target.value)}
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                    padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12,
                    outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>METHODOLOGY</label>
                <select value={rarMeta.methodology} onChange={e => mf("methodology")(e.target.value)} style={{
                  width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                  padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                  {["Interview","Examination","Testing","Hybrid"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                  letterSpacing:1, marginBottom:5 }}>OVERALL RISK DETERMINATION</label>
                <select value={rarMeta.overallRisk} onChange={e => mf("overallRisk")(e.target.value)} style={{
                  width:"100%", background:riskBgs[rarMeta.overallRisk]||"#e8eef6",
                  border:`2px solid ${riskColors[rarMeta.overallRisk]||"#c5d0de"}`, borderRadius:7,
                  padding:"9px 12px", color:riskColors[rarMeta.overallRisk]||"#0a1628",
                  fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700, outline:"none" }}>
                  {["Very High","High","Moderate","Low","Very Low"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Narrative fields */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
              {[
                { key:"purpose",     label:"PURPOSE",     ph:"State the purpose of the risk assessment..." },
                { key:"scope",       label:"SCOPE",       ph:"Define the systems, boundaries, and timeframe..." },
                { key:"assumptions", label:"ASSUMPTIONS & CONSTRAINTS", ph:"Document assumptions made during the assessment..." },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                    letterSpacing:1, marginBottom:5 }}>{f.label}</label>
                  <textarea value={rarMeta[f.key]} onChange={e => mf(f.key)(e.target.value)}
                    placeholder={f.ph} rows={3}
                    style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                      padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:11,
                      outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }} />
                </div>
              ))}
            </div>

            {/* Executive summary */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace",
                letterSpacing:1, marginBottom:5 }}>EXECUTIVE SUMMARY</label>
              <textarea value={rarMeta.execSummary} onChange={e => mf("execSummary")(e.target.value)}
                placeholder="Provide a high-level summary of findings, overall risk level, and key recommendations..." rows={3}
                style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7,
                  padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:11,
                  outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }} />
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Btn onClick={openAdd} disabled={!selSys}>＋ Add Risk</Btn>
              <Btn variant="secondary" onClick={autoGenerate} disabled={!selSys}>
                ⚡ Auto-Generate from Findings
              </Btn>
              <Btn onClick={generateReport} disabled={!selSys || risks.length === 0}
                style={{ background:"#1a7a4a", borderColor:"#1a7a4a" }}>
                📄 Generate Report
              </Btn>
            </div>
          </div>
        )}
      </div>

      {/* ── Risk summary pills ── */}
      {risks.length > 0 && (
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
          {Object.entries(byLevel).filter(([,n]) => n > 0).map(([lvl, n]) => (
            <div key={lvl} style={{ background:"#fff", border:`1px solid ${riskColors[lvl]}`,
              borderRadius:10, padding:"8px 16px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:riskColors[lvl] }} />
              <div style={{ color:riskColors[lvl], fontSize:16, fontWeight:900, fontFamily:"'Syne', sans-serif" }}>{n}</div>
              <div style={{ color:riskColors[lvl], fontSize:9, fontFamily:"'DM Mono', monospace" }}>{lvl.toUpperCase()}</div>
            </div>
          ))}
          <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:10, padding:"8px 16px" }}>
            <div style={{ color:"#0a1628", fontSize:16, fontWeight:900, fontFamily:"'Syne', sans-serif" }}>{risks.length}</div>
            <div style={{ color:"#8a9ab8", fontSize:9, fontFamily:"'DM Mono', monospace" }}>TOTAL</div>
          </div>
          {highPlusCount > 0 && (
            <div style={{ background:"#ffe0e0", border:"1px solid #cc2222", borderRadius:10,
              padding:"8px 16px", color:"#cc2222", fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700 }}>
              ⚠ {highPlusCount} HIGH+ RISK{highPlusCount !== 1 ? "S" : ""} REQUIRE IMMEDIATE ATTENTION
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RISK REGISTER VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === "register" && (
        <div>
          {risks.length === 0 && (
            <div style={{ textAlign:"center", padding:64, color:"#8a9ab8",
              border:"1px dashed #c5d0de", borderRadius:12 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>⚠</div>
              <p style={{ fontFamily:"'DM Mono', monospace", marginBottom:16 }}>
                No risks logged yet. Select a system above and add risks manually or auto-generate from open findings.
              </p>
            </div>
          )}
          <div style={{ display:"grid", gap:10 }}>
            {risks.map((r, idx) => {
              const ts  = THREAT_SOURCES.find(t => t.id === r.threatSource);
              const te  = THREAT_EVENTS.find(t => t.id === r.threatEvent);
              const inh = riskLevel(r.likelihood, r.impact);
              const res = riskLevel(r.residualLikelihood||1, r.residualImpact||1);
              return (
                <div key={r.id} style={{ background:"#fff", border:`1px solid #c5d0de`,
                  borderLeft:`5px solid ${inh.color}`, borderRadius:10, padding:"16px 20px" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:36, height:36, background:inh.bg, border:`1px solid ${inh.color}`,
                      borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                      color:inh.color, fontFamily:"'Syne', sans-serif", fontSize:11, fontWeight:900, flexShrink:0 }}>
                      R{String(idx+1).padStart(2,"0")}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                        <span style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:700 }}>
                          {r.title}
                        </span>
                        <LevelPill l={r.likelihood} i={r.impact} />
                        <span style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace" }}>→ Residual:</span>
                        <LevelPill l={r.residualLikelihood||1} i={r.residualImpact||1} />
                      </div>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:5 }}>
                        {ts && <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
                          Source: <span style={{ color:"#3a4a6b", fontWeight:700 }}>{ts.name}</span>
                        </span>}
                        {te && <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
                          Event: <span style={{ color:"#3a4a6b" }}>{te.name}</span>
                        </span>}
                        <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
                          Score: L{r.likelihood}×I{r.impact}=<strong>{r.likelihood*r.impact}</strong>
                        </span>
                        {r.stigId && <span style={{ color:"#1a7a4a", fontSize:11, fontFamily:"'DM Mono', monospace" }}>
                          {r.stigId}
                        </span>}
                      </div>
                      {r.desc && (
                        <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace",
                          marginBottom:5, lineHeight:1.5 }}>
                          {r.desc.slice(0,180)}{r.desc.length>180?"…":""}
                        </div>
                      )}
                      {r.recommendation && (
                        <div style={{ background:"#f0f7f0", border:"1px solid #c8ecd8", borderRadius:5,
                          padding:"5px 10px", marginTop:5, fontSize:11, fontFamily:"'DM Mono', monospace",
                          color:"#1a5a3a" }}>
                          ✓ Rec: {r.recommendation.slice(0,120)}{r.recommendation.length>120?"…":""}
                        </div>
                      )}
                      {(r.controls||[]).length > 0 && (
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:6 }}>
                          {r.controls.map(c => (
                            <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a", borderRadius:3,
                              padding:"1px 7px", fontSize:9, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <Btn small variant="secondary" onClick={() => openEdit(r)}>✎</Btn>
                      <button onClick={() => deleteRisk(r.id)} style={{
                        background:"none", border:"1px solid #f0c0c0", borderRadius:6,
                        padding:"4px 10px", color:"#cc2222", cursor:"pointer", fontSize:12 }}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RISK MATRIX VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === "matrix" && (
        <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:28 }}>
          <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, marginBottom:4 }}>
            5×5 Risk Matrix — NIST SP 800-30 Rev 1
          </div>
          <div style={{ color:"#6b7a99", fontSize:12, fontFamily:"'DM Mono', monospace", marginBottom:24 }}>
            Inherent risk = Likelihood of Threat Event Occurrence × Magnitude of Impact.
            Numbers in cells show risk count. Hover cells to see risk titles.
          </div>

          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            {/* Y-axis */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", width:24, height:310 }}>
              <span style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                writingMode:"vertical-rl", transform:"rotate(180deg)", letterSpacing:2 }}>
                ← LIKELIHOOD
              </span>
            </div>

            <div style={{ flex:1 }}>
              {/* Column headers (Impact) */}
              <div style={{ display:"grid", gridTemplateColumns:"90px repeat(5,1fr)", gap:4, marginBottom:4 }}>
                <div style={{ textAlign:"right", paddingRight:8, color:"#6b7a99", fontSize:9,
                  fontFamily:"'DM Mono', monospace", alignSelf:"flex-end", paddingBottom:4 }}>
                  L \ I →
                </div>
                {[...IMPACT_LEVELS].reverse().map(il => (
                  <div key={il.value} style={{ textAlign:"center", color:il.color, fontSize:9,
                    fontFamily:"'DM Mono', monospace", fontWeight:700, padding:"4px 2px",
                    background:il.bg, borderRadius:5 }}>
                    {il.label}<br/><span style={{ opacity:0.7 }}>({il.value})</span>
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {LIKELIHOOD_LEVELS.map(ll => (
                <div key={ll.value} style={{ display:"grid",
                  gridTemplateColumns:"90px repeat(5,1fr)", gap:4, marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end",
                    paddingRight:8, background:ll.bg, borderRadius:5 }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:ll.color, fontSize:9, fontFamily:"'DM Mono', monospace",
                        fontWeight:700 }}>{ll.label}</div>
                      <div style={{ color:ll.color, fontSize:8, fontFamily:"'DM Mono', monospace",
                        opacity:0.7 }}>({ll.value})</div>
                    </div>
                  </div>
                  {[...IMPACT_LEVELS].reverse().map(il => {
                    const rl   = riskLevel(ll.value, il.value);
                    const cell = risks.filter(r => r.likelihood===ll.value && r.impact===il.value);
                    return (
                      <div key={il.value} title={cell.map(r=>r.title).join("\n")} style={{
                        background:rl.bg, border:`1px solid ${rl.color}`, borderRadius:6,
                        height:56, display:"flex", alignItems:"center", justifyContent:"center",
                        flexDirection:"column", gap:1, cursor: cell.length ? "pointer" : "default",
                        transition:"transform 0.1s", transform: cell.length ? "scale(1.02)" : "scale(1)"
                      }}>
                        {cell.length > 0 && (
                          <div style={{ color:rl.color, fontSize:20, fontWeight:900,
                            fontFamily:"'Syne', sans-serif" }}>{cell.length}</div>
                        )}
                        <div style={{ color:rl.color, fontSize:7, fontFamily:"'DM Mono', monospace",
                          opacity:0.8, letterSpacing:0.5 }}>{rl.label.toUpperCase()}</div>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div style={{ textAlign:"center", color:"#6b7a99", fontSize:9,
                fontFamily:"'DM Mono', monospace", marginTop:8, letterSpacing:2 }}>
                IMPACT →
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:8, marginTop:20, flexWrap:"wrap" }}>
            {[
              { label:"Very High (15–25)", color:"#cc2222", bg:"#ffe0e0" },
              { label:"High (9–14)",       color:"#c45200", bg:"#ffe8d0" },
              { label:"Moderate (5–8)",    color:"#a07800", bg:"#fff3c0" },
              { label:"Low (2–4)",         color:"#1a7a4a", bg:"#d4f5e5" },
              { label:"Very Low (1)",      color:"#1a6a9a", bg:"#d0e8f5" },
            ].map(l => (
              <div key={l.label} style={{ background:l.bg, border:`1px solid ${l.color}`,
                borderRadius:5, padding:"4px 10px", fontSize:10, fontFamily:"'DM Mono', monospace",
                color:l.color, fontWeight:700 }}>{l.label}</div>
            ))}
          </div>

          {/* Sorted list */}
          {risks.length > 0 && (
            <div style={{ marginTop:24, borderTop:"1px solid #e8eef6", paddingTop:18 }}>
              <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace",
                letterSpacing:1, marginBottom:12 }}>RISKS SORTED BY LEVEL</div>
              {["Very High","High","Moderate","Low","Very Low"].map(lvl => {
                const lvlRisks = risks.filter(r => riskLevel(r.likelihood,r.impact).label === lvl);
                if (!lvlRisks.length) return null;
                const rc = riskColors[lvl];
                return (
                  <div key={lvl} style={{ marginBottom:14 }}>
                    <div style={{ color:rc, fontSize:11, fontFamily:"'DM Mono', monospace",
                      fontWeight:700, marginBottom:6, letterSpacing:0.5 }}>
                      {lvl.toUpperCase()} — {lvlRisks.length} risk{lvlRisks.length!==1?"s":""}
                    </div>
                    {lvlRisks.map(r => (
                      <div key={r.id} style={{ display:"flex", gap:10, alignItems:"center",
                        marginBottom:5, padding:"6px 10px", background:"#f7faff",
                        borderRadius:6, borderLeft:`3px solid ${rc}` }}>
                        <span style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace",
                          minWidth:30 }}>R{String(risks.indexOf(r)+1).padStart(2,"0")}</span>
                        <span style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace",
                          flex:1 }}>{r.title}</span>
                        <span style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace" }}>
                          L{r.likelihood}×I{r.impact}={r.likelihood*r.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          FULL REPORT VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === "report" && (
        <div>
          {!generated && (
            <div style={{ background:"#fff8e8", border:"1px solid #e8c840", borderRadius:12,
              padding:32, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📄</div>
              <div style={{ color:"#6b4e00", fontFamily:"'DM Mono', monospace", fontSize:14,
                fontWeight:700, marginBottom:8 }}>Report Not Yet Generated</div>
              <div style={{ color:"#8a7040", fontFamily:"'DM Mono', monospace", fontSize:12,
                marginBottom:20 }}>
                Fill in the assessment configuration above, add your risks, then click
                <strong> "📄 Generate Report"</strong> to lock the report snapshot.
              </div>
              <Btn onClick={generateReport} disabled={!selSys || risks.length === 0}>
                📄 Generate Report Now
              </Btn>
            </div>
          )}

          {generated && (
            <div>
              {/* Controls bar */}
              <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center",
                background:"#f0f7ff", border:"1px solid #c0d4f0", borderRadius:10, padding:"12px 16px" }}>
                <span style={{ color:"#1a3a7a", fontSize:12, fontFamily:"'DM Mono', monospace",
                  fontWeight:700, flex:1 }}>
                  ✓ Report generated {generated.generatedAt}
                </span>
                <Btn small variant="secondary" onClick={generateReport}>↺ Regenerate</Btn>
                <Btn small onClick={printReport}>🖨 Print / Export PDF</Btn>
              </div>

              {/* ── PRINTABLE REPORT ── */}
              <div id="rar-print-area" style={{ background:"#fff", border:"1px solid #c5d0de",
                borderRadius:12, padding:"40px 48px", lineHeight:1.7 }}>

                {/* ── COVER PAGE ── */}
                <div style={{ borderBottom:"3px solid #1a3a7a", paddingBottom:32, marginBottom:32 }}>
                  <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace",
                    letterSpacing:3, marginBottom:12, textTransform:"uppercase" }}>
                    Risk Assessment Report
                  </div>
                  <h1 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:30,
                    margin:"0 0 8px", lineHeight:1.2 }}>
                    {generated.meta.title || `${generated.sys.name} Risk Assessment`}
                  </h1>
                  <div style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                    marginBottom:8 }}>
                    {generated.sys.name} · {generated.sys.classification} · {generated.sys.type}
                  </div>
                  <div style={{ display:"inline-block", background:riskBgs[generated.meta.overallRisk]||"#e8eef6",
                    border:`2px solid ${riskColors[generated.meta.overallRisk]||"#c5d0de"}`,
                    borderRadius:8, padding:"6px 20px", marginBottom:24 }}>
                    <span style={{ color:riskColors[generated.meta.overallRisk], fontFamily:"'DM Mono', monospace",
                      fontSize:12, fontWeight:700 }}>
                      OVERALL RISK: {generated.meta.overallRisk.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {[
                      ["Prepared By",    generated.meta.preparedBy||"—"],
                      ["Organization",   generated.meta.org||generated.sys.owner||"—"],
                      ["Version",        generated.meta.version||"1.0"],
                      ["Date",           generated.meta.date||today()],
                      ["System Owner",   generated.sys.owner||"—"],
                      ["Classification", generated.sys.classification],
                      ["ATO Date",       generated.sys.atoDate||"—"],
                      ["Methodology",    generated.meta.methodology||"Hybrid"],
                    ].map(([l,v]) => (
                      <div key={l} style={{ background:"#e8eef6", borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                          letterSpacing:1, marginBottom:4 }}>{l.toUpperCase()}</div>
                        <div style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace",
                          fontWeight:700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 1: EXECUTIVE SUMMARY ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    1. Executive Summary
                  </div>
                  <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                    lineHeight:1.8, margin:"0 0 14px" }}>
                    This Risk Assessment Report (RAR) was conducted in accordance with{" "}
                    <em>NIST Special Publication 800-30 Rev 1, Guide for Conducting Risk Assessments</em>.
                    The assessment evaluates the risk to organizational operations, organizational assets,
                    individuals, other organizations, and the nation from operation of{" "}
                    <strong>{generated.sys.name}</strong>, a {generated.sys.type} operating in a{" "}
                    {generated.sys.environment} environment.
                  </p>
                  {generated.meta.execSummary && (
                    <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                      lineHeight:1.8, margin:"0 0 14px" }}>{generated.meta.execSummary}</p>
                  )}

                  {/* Risk summary table */}
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", margin:"16px 0" }}>
                    {Object.entries(generated.byLevel).filter(([,n])=>n>0).map(([lvl,n]) => (
                      <div key={lvl} style={{ background:riskBgs[lvl]||"#e8eef6",
                        border:`1px solid ${riskColors[lvl]||"#c5d0de"}`, borderRadius:8,
                        padding:"10px 18px", textAlign:"center", minWidth:80 }}>
                        <div style={{ color:riskColors[lvl], fontSize:24, fontWeight:900,
                          fontFamily:"'Syne', sans-serif" }}>{n}</div>
                        <div style={{ color:riskColors[lvl], fontSize:9,
                          fontFamily:"'DM Mono', monospace" }}>{lvl.toUpperCase()}</div>
                      </div>
                    ))}
                    <div style={{ background:"#e8eef6", border:"1px solid #c5d0de",
                      borderRadius:8, padding:"10px 18px", textAlign:"center", minWidth:80 }}>
                      <div style={{ color:"#0a1628", fontSize:24, fontWeight:900,
                        fontFamily:"'Syne', sans-serif" }}>{generated.risks.length}</div>
                      <div style={{ color:"#8a9ab8", fontSize:9, fontFamily:"'DM Mono', monospace" }}>
                        TOTAL RISKS
                      </div>
                    </div>
                  </div>

                  <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                    lineHeight:1.8, margin:"0 0 14px" }}>
                    The system has <strong>{generated.openVulns}</strong> open vulnerabilities and{" "}
                    <strong>{generated.poamCount}</strong> active Plans of Action and Milestones (POA&Ms).
                    The overall risk determination is{" "}
                    <strong style={{ color:riskColors[generated.meta.overallRisk] }}>
                      {generated.meta.overallRisk}
                    </strong>.
                  </p>
                </div>

                {/* ── SECTION 2: ASSESSMENT PURPOSE & SCOPE ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    2. Purpose, Scope, and Assumptions
                  </div>
                  {[
                    { label:"2.1 Purpose",   val: generated.meta.purpose   || `This risk assessment was conducted to identify, analyze, and prioritize risks to ${generated.sys.name} per NIST SP 800-30 Rev 1 and support the RMF authorization decision.` },
                    { label:"2.2 Scope",     val: generated.meta.scope     || `The scope of this assessment encompasses ${generated.sys.name} and all system components operating within the authorization boundary.` },
                    { label:"2.3 Assumptions & Constraints", val: generated.meta.assumptions || "This assessment assumes that findings from STIG/ACAS scans are current. Results are based on available information at the time of assessment." },
                  ].map(sec => (
                    <div key={sec.label} style={{ marginBottom:16 }}>
                      <div style={{ color:"#3a4a6b", fontFamily:"'Syne', sans-serif", fontSize:13,
                        fontWeight:700, marginBottom:6 }}>{sec.label}</div>
                      <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                        lineHeight:1.8, margin:0 }}>{sec.val}</p>
                    </div>
                  ))}
                </div>

                {/* ── SECTION 3: METHODOLOGY ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    3. Risk Assessment Methodology
                  </div>
                  <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                    lineHeight:1.8, margin:"0 0 12px" }}>
                    This assessment follows the NIST SP 800-30 Rev 1 three-step process:
                    (1) Prepare for assessment, (2) Conduct assessment, and (3) Communicate results.
                    Assessment methodology: <strong>{generated.meta.methodology}</strong>.
                  </p>
                  <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                    lineHeight:1.8, margin:"0 0 12px" }}>
                    Risk is expressed as the combination of <strong>likelihood of threat event occurrence</strong>{" "}
                    and <strong>magnitude of adverse impact</strong> using a five-level ordinal scale
                    (Very Low = 1, Low = 2, Moderate = 3, High = 4, Very High = 5).
                    Inherent risk reflects exposure before controls; residual risk reflects exposure
                    after existing security controls are applied.
                  </p>

                  {/* Mini risk matrix */}
                  <div style={{ background:"#f0f4f8", borderRadius:10, padding:16, marginTop:12 }}>
                    <div style={{ color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace",
                      fontWeight:700, marginBottom:10, letterSpacing:1 }}>
                      RISK LEVEL DETERMINATION — 5×5 ORDINAL MATRIX
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"60px repeat(5,1fr)", gap:2 }}>
                      <div/>
                      {[...IMPACT_LEVELS].reverse().map(il => (
                        <div key={il.value} style={{ textAlign:"center", color:il.color,
                          fontSize:8, fontFamily:"'DM Mono', monospace", fontWeight:700,
                          padding:"3px 0", background:il.bg, borderRadius:3 }}>
                          I:{il.value}
                        </div>
                      ))}
                      {LIKELIHOOD_LEVELS.map(ll => (
                        [
                          <div key={`l${ll.value}`} style={{ display:"flex", alignItems:"center",
                            justifyContent:"flex-end", paddingRight:6, background:ll.bg, borderRadius:3 }}>
                            <span style={{ color:ll.color, fontSize:8, fontFamily:"'DM Mono', monospace",
                              fontWeight:700 }}>L:{ll.value}</span>
                          </div>,
                          ...[...IMPACT_LEVELS].reverse().map(il => {
                            const rl = riskLevel(ll.value, il.value);
                            return (
                              <div key={il.value} style={{ background:rl.bg, border:`1px solid ${rl.color}`,
                                borderRadius:3, height:28, display:"flex", alignItems:"center",
                                justifyContent:"center" }}>
                                <span style={{ color:rl.color, fontSize:7,
                                  fontFamily:"'DM Mono', monospace", fontWeight:700 }}>
                                  {ll.value*il.value}
                                </span>
                              </div>
                            );
                          })
                        ]
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── SECTION 4: SYSTEM CHARACTERIZATION ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    4. System Characterization
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    {[
                      ["System Name",       generated.sys.name],
                      ["System Type",       generated.sys.type],
                      ["Owner",             generated.sys.owner||"—"],
                      ["Classification",    generated.sys.classification],
                      ["Environment",       generated.sys.environment||"—"],
                      ["FIPS 199 Impact",   generated.sys.impact||"—"],
                      ["ATO Date",          generated.sys.atoDate||"—"],
                      ["Review Date",       generated.sys.reviewDate||"—"],
                    ].map(([l,v]) => (
                      <div key={l} style={{ display:"flex", gap:8, padding:"8px 0",
                        borderBottom:"1px solid #e8eef6" }}>
                        <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace",
                          minWidth:130 }}>{l}:</span>
                        <span style={{ color:"#0a1628", fontSize:11, fontFamily:"'DM Mono', monospace",
                          fontWeight:700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {generated.sys.description && (
                    <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace",
                      lineHeight:1.8, margin:"14px 0 0" }}>{generated.sys.description}</p>
                  )}
                </div>

                {/* ── SECTION 5: RISK FINDINGS ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    5. Risk Findings ({generated.risks.length})
                  </div>
                  {generated.risks.length === 0 && (
                    <p style={{ color:"#8a9ab8", fontFamily:"'DM Mono', monospace", fontSize:12 }}>
                      No risks were documented for this assessment.
                    </p>
                  )}
                  {generated.risks.map((r, idx) => {
                    const ts  = THREAT_SOURCES.find(t => t.id === r.threatSource);
                    const te  = THREAT_EVENTS.find(t => t.id === r.threatEvent);
                    const inh = riskLevel(r.likelihood, r.impact);
                    const res = riskLevel(r.residualLikelihood||1, r.residualImpact||1);
                    return (
                      <div key={r.id} style={{ border:`1px solid ${inh.color}`, borderRadius:10,
                        marginBottom:18, overflow:"hidden" }}>
                        {/* Risk header */}
                        <div style={{ background:inh.bg, padding:"12px 18px",
                          display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                          <span style={{ color:inh.color, fontFamily:"'Syne', sans-serif",
                            fontSize:13, fontWeight:900, minWidth:36 }}>
                            {r.riskNum}
                          </span>
                          <span style={{ color:inh.color, fontFamily:"'Syne', sans-serif",
                            fontSize:14, fontWeight:900, flex:1 }}>{r.title}</span>
                          <div style={{ display:"flex", gap:8 }}>
                            <span style={{ background:inh.color, color:"#fff", borderRadius:12,
                              padding:"3px 12px", fontSize:10, fontFamily:"'DM Mono', monospace",
                              fontWeight:700 }}>Inherent: {inh.label}</span>
                            <span style={{ background:res.color, color:"#fff", borderRadius:12,
                              padding:"3px 12px", fontSize:10, fontFamily:"'DM Mono', monospace",
                              fontWeight:700 }}>Residual: {res.label}</span>
                          </div>
                        </div>

                        {/* Risk body */}
                        <div style={{ padding:"16px 18px", display:"grid",
                          gridTemplateColumns:"1fr 1fr", gap:16 }}>
                          <div>
                            <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                              letterSpacing:1, marginBottom:4 }}>THREAT SOURCE</div>
                            <div style={{ color:"#0a1628", fontSize:12,
                              fontFamily:"'DM Mono', monospace", fontWeight:700 }}>
                              {ts?.name||r.threatSource}
                              {ts?.type && <span style={{ color:"#8a9ab8", fontWeight:400 }}>
                                {" "}({ts.type})
                              </span>}
                            </div>
                          </div>
                          <div>
                            <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                              letterSpacing:1, marginBottom:4 }}>THREAT EVENT</div>
                            <div style={{ color:"#0a1628", fontSize:12,
                              fontFamily:"'DM Mono', monospace" }}>{te?.name||r.threatEvent}</div>
                          </div>
                          <div>
                            <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                              letterSpacing:1, marginBottom:4 }}>INHERENT RISK (L × I = Score)</div>
                            <div style={{ color:"#0a1628", fontSize:12,
                              fontFamily:"'DM Mono', monospace" }}>
                              {LIKELIHOOD_LEVELS.find(l=>l.value===r.likelihood)?.label} ({r.likelihood}) ×{" "}
                              {IMPACT_LEVELS.find(l=>l.value===r.impact)?.label} ({r.impact}) ={" "}
                              <strong>{r.likelihood*r.impact}</strong> → {inh.label}
                            </div>
                          </div>
                          <div>
                            <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                              letterSpacing:1, marginBottom:4 }}>RESIDUAL RISK (AFTER CONTROLS)</div>
                            <div style={{ color:"#0a1628", fontSize:12,
                              fontFamily:"'DM Mono', monospace" }}>
                              L:{r.residualLikelihood||1} × I:{r.residualImpact||1} ={" "}
                              {(r.residualLikelihood||1)*(r.residualImpact||1)} → {res.label}
                            </div>
                          </div>
                          {r.desc && (
                            <div style={{ gridColumn:"1/-1" }}>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:4 }}>RISK DESCRIPTION</div>
                              <p style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace",
                                lineHeight:1.7, margin:0 }}>{r.desc}</p>
                            </div>
                          )}
                          {r.currentControls && (
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:4 }}>CURRENT CONTROLS</div>
                              <div style={{ color:"#3a4a6b", fontSize:12,
                                fontFamily:"'DM Mono', monospace" }}>{r.currentControls}</div>
                            </div>
                          )}
                          {r.recommendation && (
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:4 }}>RECOMMENDATION / RISK RESPONSE</div>
                              <p style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace",
                                lineHeight:1.7, margin:0 }}>{r.recommendation}</p>
                            </div>
                          )}
                          {(r.controls||[]).length > 0 && (
                            <div style={{ gridColumn:"1/-1" }}>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:6 }}>NIST 800-53 CONTROLS</div>
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                {r.controls.map(c => (
                                  <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a",
                                    borderRadius:3, padding:"2px 8px", fontSize:10,
                                    fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {r.cciRefs?.length > 0 && (
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:4 }}>CCI REFERENCES</div>
                              <div style={{ color:"#6b7a99", fontSize:11,
                                fontFamily:"'DM Mono', monospace" }}>
                                {r.cciRefs.slice(0,6).join(", ")}{r.cciRefs.length>6?` +${r.cciRefs.length-6} more`:""}
                              </div>
                            </div>
                          )}
                          {r.stigId && (
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace",
                                letterSpacing:1, marginBottom:4 }}>STIG ID</div>
                              <div style={{ color:"#1a7a4a", fontSize:12,
                                fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{r.stigId}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── SECTION 6: RISK RESPONSE / RECOMMENDATIONS ── */}
                <div style={{ marginBottom:32 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:17,
                    fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:8, marginBottom:16 }}>
                    6. Risk Response Recommendations
                  </div>
                  {["Very High","High","Moderate"].map(lvl => {
                    const lvlRisks = generated.risks.filter(r => riskLevel(r.likelihood,r.impact).label === lvl);
                    if (!lvlRisks.length) return null;
                    return (
                      <div key={lvl} style={{ marginBottom:18 }}>
                        <div style={{ color:riskColors[lvl], fontFamily:"'Syne', sans-serif",
                          fontSize:13, fontWeight:900, marginBottom:10,
                          background:riskBgs[lvl], padding:"6px 14px", borderRadius:6,
                          display:"inline-block" }}>
                          {lvl} Risk — {lvlRisks.length} item{lvlRisks.length!==1?"s":""}
                          {lvl === "Very High" ? " (Immediate Action Required)" :
                           lvl === "High"      ? " (Priority Remediation Required)" :
                                                 " (Address Within POA&M Cycle)"}
                        </div>
                        {lvlRisks.map((r, i) => (
                          <div key={r.id} style={{ display:"flex", gap:12, padding:"8px 0",
                            borderBottom:"1px solid #f0f4f8", alignItems:"flex-start" }}>
                            <span style={{ color:riskColors[lvl], fontFamily:"'DM Mono', monospace",
                              fontSize:11, fontWeight:700, minWidth:36 }}>{r.riskNum}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:"#0a1628", fontSize:12,
                                fontFamily:"'DM Mono', monospace", fontWeight:700,
                                marginBottom:2 }}>{r.title}</div>
                              {r.recommendation && (
                                <div style={{ color:"#3a4a6b", fontSize:11,
                                  fontFamily:"'DM Mono', monospace", lineHeight:1.6 }}>
                                  {r.recommendation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* ── Footer ── */}
                <div style={{ borderTop:"2px solid #1a3a7a", paddingTop:16, marginTop:8,
                  display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                  <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace" }}>
                    Generated: {generated.generatedAt}<br/>
                    Authority: NIST SP 800-30 Rev 1 · NIST SP 800-53 Rev 5<br/>
                    Classification: {generated.sys.classification||"UNCLASSIFIED"}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif",
                      fontSize:13, fontWeight:900 }}>RMF TRACKER</div>
                    <div style={{ color:"#7caadf", fontSize:9, fontFamily:"'DM Mono', monospace",
                      letterSpacing:2 }}>NIST 800-53 REV 5</div>
                  </div>
                </div>
              </div>
              {/* End printable area */}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ADD / EDIT RISK MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <Modal title={editRisk ? "Edit Risk Entry" : "Add Risk Entry"} onClose={() => { setShowAdd(false); setEditRisk(null); }} width={800}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>RISK TITLE *</label>
              <input value={riskForm.title||""} onChange={e=>rf("title")(e.target.value)}
                placeholder="e.g. Unauthorized access via unpatched SSH vulnerability"
                style={{ width:"100%", background:"#fff", border:"2px solid #1a3a7a", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:13, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>THREAT SOURCE</label>
              <select value={riskForm.threatSource||"TS-1"} onChange={e=>rf("threatSource")(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }}>
                {THREAT_SOURCES.map(t => <option key={t.id} value={t.id}>{t.id} — {t.name} ({t.type})</option>)}
              </select>
              <div style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:4 }}>
                {THREAT_SOURCES.find(t=>t.id===riskForm.threatSource)?.desc}
              </div>
            </div>
            <div>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>THREAT EVENT</label>
              <select value={riskForm.threatEvent||"TE-1"} onChange={e=>rf("threatEvent")(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }}>
                {THREAT_EVENTS.map(t => <option key={t.id} value={t.id}>{t.id} — {t.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>RISK DESCRIPTION</label>
              <textarea value={riskForm.desc||""} onChange={e=>rf("desc")(e.target.value)} rows={3}
                placeholder="Describe the risk scenario, vulnerability exploited, and potential adverse impact on mission/operations..."
                style={{ width:"100%", background:"#fff", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }} />
            </div>
          </div>

          <LevelSelector label="LIKELIHOOD OF THREAT EVENT OCCURRENCE (INHERENT)" value={riskForm.likelihood||3} onChange={v=>rf("likelihood")(v)} levels={LIKELIHOOD_LEVELS} />
          <LevelSelector label="MAGNITUDE OF ADVERSE IMPACT (INHERENT)" value={riskForm.impact||3} onChange={v=>rf("impact")(v)} levels={IMPACT_LEVELS} />

          {(() => {
            const rl = riskLevel(riskForm.likelihood||3, riskForm.impact||3);
            return (
              <div style={{ background:rl.bg, border:`2px solid ${rl.color}`, borderRadius:8, padding:"10px 18px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ color:rl.color, fontFamily:"'DM Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:1 }}>INHERENT RISK LEVEL</div>
                  <div style={{ color:rl.color, fontSize:11, fontFamily:"'DM Mono', monospace", marginTop:2 }}>
                    L:{riskForm.likelihood||3} × I:{riskForm.impact||3} = Score {(riskForm.likelihood||3)*(riskForm.impact||3)}
                  </div>
                </div>
                <span style={{ color:rl.color, fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:900 }}>{rl.label}</span>
              </div>
            );
          })()}

          <div style={{ borderTop:"1px solid #e8eef6", paddingTop:16, marginBottom:4 }}>
            <div style={{ color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:12, fontWeight:700 }}>RESIDUAL RISK (AFTER EXISTING CONTROLS)</div>
            <LevelSelector label="RESIDUAL LIKELIHOOD" value={riskForm.residualLikelihood||1} onChange={v=>rf("residualLikelihood")(v)} levels={LIKELIHOOD_LEVELS} />
            <LevelSelector label="RESIDUAL IMPACT" value={riskForm.residualImpact||1} onChange={v=>rf("residualImpact")(v)} levels={IMPACT_LEVELS} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>CURRENT CONTROLS IN PLACE</label>
              <input value={riskForm.currentControls||""} onChange={e=>rf("currentControls")(e.target.value)}
                placeholder="e.g. AC-2, IA-5 implemented; firewall rules in place"
                style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>RECOMMENDATIONS / RISK RESPONSE</label>
              <textarea value={riskForm.recommendation||""} onChange={e=>rf("recommendation")(e.target.value)} rows={3}
                placeholder="Risk response: Mitigate, Transfer, Avoid, or Accept. Describe specific recommended actions..."
                style={{ width:"100%", background:"#fff", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }} />
            </div>
          </div>

          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:18 }}>
            <Btn variant="secondary" onClick={() => { setShowAdd(false); setEditRisk(null); }}>Cancel</Btn>
            <Btn onClick={saveRisk} disabled={!riskForm.title}>
              {editRisk ? "Update Risk" : "＋ Add Risk"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ── Controls View ─────────────────────────────────────────────────────────
function ControlsView({ systems, vulnerabilities, setVulnerabilities, controlStatuses, setControlStatuses, poams, setPoams, defaultSystemId }) {
  const [selectedSystem, setSelectedSystem] = useState(defaultSystemId || "__org__");
  useEffect(() => { if (defaultSystemId) setSelectedSystem(defaultSystemId); }, [defaultSystemId]);
  const [filterFamily, setFilterFamily] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBaseline, setFilterBaseline] = useState("all");
  const [search, setSearch] = useState("");
  const [editingControl, setEditingControl] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewMode, setViewMode] = useState("table");
  const [openCCI, setOpenCCI] = useState(null);
  const ef = (k) => (v) => setEditForm(p => ({ ...p, [k]: v }));

  // ── POAM creation state (lives here in ControlsView) ──
  const [ctrlPoamVuln, setCtrlPoamVuln] = useState(null);
  const [ctrlPoamControl, setCtrlPoamControl] = useState(null);
  const [ctrlPoamForm, setCtrlPoamForm] = useState({});
  const cpf = (k) => (v) => setCtrlPoamForm(p => ({ ...p, [k]: v }));

  const openCtrlPoamModal = (vuln, ctrl) => {
    const sys = systems.find(s => s.id === vuln.systemId);
    const daysOut = { Critical: 30, High: 30, Medium: 90, Low: 180, Info: 180 }[vuln.severity] || 90;
    const due = new Date(); due.setDate(due.getDate() + daysOut);
    setCtrlPoamForm({
      title: vuln.title || "",
      weaknessDesc: vuln.description || "",
      remediation: vuln.remediation || "",
      responsible: sys?.owner || "",
      resources: "",
      scheduledCompletion: due.toISOString().split("T")[0],
      status: "Open",
      poamType: vuln.source === "STIG" ? "Technical Finding" : "Vulnerability",
      milestones: "1. Assign remediation owner\n2. Develop remediation plan\n3. Implement fix\n4. Validate and close",
      comments: vuln.findingDetails || vuln.comments || "",
    });
    setCtrlPoamVuln(vuln);
    setCtrlPoamControl(ctrl);
  };

  const confirmCtrlPoam = () => {
    if (!ctrlPoamForm.title || !ctrlPoamVuln) return;
    const poam = {
      id: uid(),
      vulnId: ctrlPoamVuln.id,
      systemId: ctrlPoamVuln.systemId,
      severity: ctrlPoamVuln.severity,
      source: ctrlPoamVuln.source,
      stigId: ctrlPoamVuln.stigId || null,
      pluginId: ctrlPoamVuln.pluginId || null,
      controls: ctrlPoamVuln.controls || [],
      cciRefs: ctrlPoamVuln.cciRefs || [],
      createdAt: today(),
      ...ctrlPoamForm,
    };
    setPoams(p => [...p, poam]);
    setVulnerabilities(p => p.map(v => v.id === ctrlPoamVuln.id ? { ...v, poamId: poam.id } : v));
    setCtrlPoamVuln(null);
    setCtrlPoamControl(null);
  };

  const statusKey = (sysId, ctrlId) => `${sysId}::${ctrlId}`;

  // ── Core: derive effective control status from ingested vulnerabilities ──
  // This runs on every render — it merges manually-set statuses with
  // auto-derived status from findings so the controls view always reflects
  // what was actually ingested from STIGs and ACAS scans.
  const deriveControlStatus = (sysId, ctrlId) => {
    const manual = controlStatuses[statusKey(sysId, ctrlId)];

    // If a human has explicitly set a status other than the default, respect it
    if (manual && manual.manuallySet) return manual;

    // Find all vulns for this system that touch this control
    const affVulns = vulnerabilities.filter(v => {
      const sysMatch = sysId === "__org__" ? true : v.systemId === sysId;
      return sysMatch && (v.controls || []).includes(ctrlId);
    });

    if (affVulns.length === 0) {
      // No findings at all — fall back to manual or default
      return manual || { status: "Not Implemented", notes: "", lastReviewed: "", owner: "" };
    }

    // Tally findings by status
    const open        = affVulns.filter(v => v.status === "Open");
    const inProgress  = affVulns.filter(v => v.status === "In Progress");
    const closed      = affVulns.filter(v => v.status === "Closed");
    const fp          = affVulns.filter(v => v.status === "False Positive");
    const riskAccepted= affVulns.filter(v => v.status === "Risk Accepted");

    const openCrit = open.filter(v => ["Critical","High"].includes(v.severity));
    const openMed  = open.filter(v => v.severity === "Medium");
    const openLow  = open.filter(v => v.severity === "Low");

    let derivedStatus;
    if (openCrit.length > 0) {
      derivedStatus = "Non-Compliant";
    } else if (openMed.length > 0 || inProgress.length > 0) {
      derivedStatus = "Non-Compliant";
    } else if (openLow.length > 0) {
      derivedStatus = "Non-Compliant";
    } else if (riskAccepted.length > 0 && open.length === 0) {
      derivedStatus = "Risk Accepted";
    } else if (closed.length > 0 || fp.length > 0) {
      // All findings closed/FP — control is compliant
      derivedStatus = "Compliant";
    } else {
      derivedStatus = "Not Implemented";
    }

    // Build source note
    const sources = [...new Set(affVulns.map(v => v.source))].join(", ");
    const autoNote = `Auto-derived from ${affVulns.length} finding(s) [${sources}]. `
      + `Open: ${open.length}, Closed: ${closed.length}, In Progress: ${inProgress.length}.`;

    return {
      ...(manual || {}),
      status: derivedStatus,
      autoNote,
      derived: true,
      findingCount: affVulns.length,
      openCount: open.length,
      closedCount: closed.length,
    };
  };

  const getStatus = (sysId, ctrlId) => deriveControlStatus(sysId, ctrlId);

  const openEdit = (ctrl) => {
    const s = getStatus(selectedSystem, ctrl.id);
    setEditForm({ ...s, controlId: ctrl.id, controlTitle: ctrl.title });
    setEditingControl(ctrl);
  };

  const saveEdit = () => {
    const key = statusKey(selectedSystem, editingControl.id);
    // Mark as manually set so it won't be overridden by auto-derive
    setControlStatuses(p => ({ ...p, [key]: { ...editForm, manuallySet: true } }));
    setEditingControl(null);
  };

  const clearManual = (ctrlId) => {
    const key = statusKey(selectedSystem, ctrlId);
    setControlStatuses(p => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  };

  const bulkSet = (status) => {
    const updates = {};
    filtered.forEach(ctrl => {
      const key = statusKey(selectedSystem, ctrl.id);
      updates[key] = { ...getStatus(selectedSystem, ctrl.id), status, manuallySet: true };
    });
    setControlStatuses(p => ({ ...p, ...updates }));
  };

  // Filter logic
  const filtered = ALL_CONTROLS.filter(ctrl => {
    if (filterFamily !== "all" && ctrl.family !== filterFamily) return false;
    if (filterBaseline !== "all" && !ctrl.baseline.includes(filterBaseline)) return false;
    const s = getStatus(selectedSystem, ctrl.id);
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (search && !ctrl.id.toLowerCase().includes(search.toLowerCase()) && !ctrl.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Stats — use derived statuses
  const allStatuses = ALL_CONTROLS.map(c => getStatus(selectedSystem, c.id).status);
  const statCounts = {
    "Implemented":     allStatuses.filter(s => s === "Implemented").length,
    "Not Implemented": allStatuses.filter(s => s === "Not Implemented").length,
    "Compliant":       allStatuses.filter(s => s === "Compliant").length,
    "Non-Compliant":   allStatuses.filter(s => s === "Non-Compliant").length,
    "Planned":         allStatuses.filter(s => s === "Planned").length,
    "Inherited":       allStatuses.filter(s => s === "Inherited").length,
    "Not Applicable":  allStatuses.filter(s => s === "Not Applicable").length,
    "Risk Accepted":   allStatuses.filter(s => s === "Risk Accepted").length,
  };
  const implementedPct = Math.round(
    (statCounts["Implemented"] + statCounts["Compliant"] + statCounts["Inherited"]) / ALL_CONTROLS.length * 100
  );

  // Controls affected by ingested findings (for quick visibility)
  const affectedControls = new Set(
    vulnerabilities
      .filter(v => selectedSystem === "__org__" || v.systemId === selectedSystem)
      .flatMap(v => v.controls || [])
  );

  const byFamily = {};
  filtered.forEach(ctrl => {
    if (!byFamily[ctrl.family]) byFamily[ctrl.family] = [];
    byFamily[ctrl.family].push(ctrl);
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 22, margin: 0 }}>Controls Compliance</h2>
          <p style={{ color: "#6b7a99", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>
            NIST SP 800-53 Rev 5 — {ALL_CONTROLS.length} controls · {affectedControls.size} affected by ingested findings
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn small variant={viewMode === "table" ? "primary" : "secondary"} onClick={() => setViewMode("table")}>≡ Table</Btn>
          <Btn small variant={viewMode === "heatmap" ? "primary" : "secondary"} onClick={() => setViewMode("heatmap")}>⊞ Heatmap</Btn>
        </div>
      </div>

      {/* System Selector + Stats Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>VIEWING CONTROLS FOR</label>
            <select value={selectedSystem} onChange={e => setSelectedSystem(e.target.value)} style={{
              background: "#f0f4f8", border: "1px solid #1a3a7a", borderRadius: 8,
              padding: "10px 14px", color: "#0a1628", fontFamily: "'Syne', sans-serif",
              fontSize: 14, fontWeight: 700, outline: "none", width: "100%"
            }}>
              <option value="__org__">🏢 Organization-wide</option>
              {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(statCounts).filter(([,v]) => v > 0).map(([status, count]) => {
              const statusMeta = {
                "Implemented":     { color: "#1a7a4a", bg: "#d4f5e5" },
                "Not Implemented": { color: "#cc2222", bg: "#ffe0e0" },
                "Compliant":       { color: "#1a3a7a", bg: "#d0dff5" },
                "Non-Compliant":   { color: "#c45200", bg: "#ffe8d0" },
                "Not Applicable":  { color: "#6b7a99", bg: "#e8eef6" },
                "Inherited":       { color: "#6633bb", bg: "#ede0ff" },
                "Planned":         { color: "#8a6200", bg: "#fff3c0" },
                "Risk Accepted":   { color: "#6633bb", bg: "#ede0ff" },
              };
              const m = statusMeta[status] || { color: "#6b7a99", bg: "#e8eef6" };
              return (
                <div key={status} onClick={() => setFilterStatus(filterStatus === status ? "all" : status)}
                  style={{ background: m.bg, border: `1px solid ${m.color}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", transition: "all 0.15s", opacity: filterStatus !== "all" && filterStatus !== status ? 0.4 : 1 }}>
                  <div style={{ color: m.color, fontSize: 18, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{count}</div>
                  <div style={{ color: m.color, fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: 1, opacity: 0.8 }}>{status.toUpperCase()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance progress bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>IMPLEMENTATION PROGRESS</span>
            <span style={{ color: implementedPct >= 80 ? "#1a7a4a" : implementedPct >= 50 ? "#8a6200" : "#cc2222", fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{implementedPct}%</span>
          </div>
          <div style={{ background: "#e8eef6", borderRadius: 6, height: 10, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(statCounts["Implemented"] / ALL_CONTROLS.length) * 100}%`, background: "#1a7a4a", transition: "width 0.4s" }} />
            <div style={{ width: `${(statCounts["Compliant"] / ALL_CONTROLS.length) * 100}%`, background: "#1a3a7a", transition: "width 0.4s" }} />
            <div style={{ width: `${(statCounts["Inherited"] / ALL_CONTROLS.length) * 100}%`, background: "#6633bb", transition: "width 0.4s" }} />
            <div style={{ width: `${(statCounts["Planned"] / ALL_CONTROLS.length) * 100}%`, background: "#8a6200", transition: "width 0.4s" }} />
            <div style={{ width: `${(statCounts["Non-Compliant"] / ALL_CONTROLS.length) * 100}%`, background: "#c45200", transition: "width 0.4s" }} />
            <div style={{ width: `${(statCounts["Not Implemented"] / ALL_CONTROLS.length) * 100}%`, background: "#cc2222", transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {[["#1a7a4a","Implemented"],["#1a3a7a","Compliant"],["#6633bb","Inherited"],["#8a6200","Planned"],["#c45200","Non-Compliant"],["#cc2222","Not Implemented"]].map(([c,l]) => (
              <span key={l} style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, background: c, borderRadius: 2, display: "inline-block" }} />{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Bulk actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search controls…" style={{
          background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8,
          padding: "8px 12px", color: "#0a1628", fontFamily: "'DM Mono', monospace",
          fontSize: 12, outline: "none", width: 200
        }} />
        <select value={filterFamily} onChange={e => setFilterFamily(e.target.value)} style={{ background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8, padding: "8px 12px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          <option value="all">All Families</option>
          {Object.entries(CONTROL_FAMILIES).map(([k, v]) => <option key={k} value={k}>{k} – {v}</option>)}
        </select>
        <select value={filterBaseline} onChange={e => setFilterBaseline(e.target.value)} style={{ background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8, padding: "8px 12px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          <option value="all">All Baselines</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#e8eef6", border: "1px solid #c5d0de", borderRadius: 8, padding: "8px 12px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
          <option value="all">All Statuses</option>
          {[...Object.keys(CTRL_STATUS_META), "Risk Accepted"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ color: "#8a9ab8", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Bulk:</span>
        {["Implemented","Not Implemented","Not Applicable"].map(s => {
          const m = CTRL_STATUS_META[s] || { bg: "#e8eef6", color: "#6b7a99" };
          return (
            <button key={s} onClick={() => bulkSet(s)} style={{
              background: m.bg, border: `1px solid ${m.color}`, borderRadius: 6,
              padding: "6px 12px", color: m.color, fontFamily: "'DM Mono', monospace",
              fontSize: 10, cursor: "pointer", letterSpacing: 0.5, fontWeight: 700
            }}>Set {s}</button>
          );
        })}
        <span style={{ marginLeft: "auto", color: "#6b7a99", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{filtered.length} controls</span>
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div style={{ display: "grid", gap: 6 }}>
          {filtered.map(ctrl => {
            const st = getStatus(selectedSystem, ctrl.id);
            const statusMeta = {
              "Implemented":     { color: "#1a7a4a", bg: "#d4f5e5", icon: "✓", label: "Implemented" },
              "Not Implemented": { color: "#cc2222", bg: "#ffe0e0", icon: "✗", label: "Not Implemented" },
              "Compliant":       { color: "#1a3a7a", bg: "#d0dff5", icon: "●", label: "Compliant" },
              "Non-Compliant":   { color: "#c45200", bg: "#ffe8d0", icon: "▲", label: "Non-Compliant" },
              "Not Applicable":  { color: "#6b7a99", bg: "#e8eef6", icon: "—", label: "Not Applicable" },
              "Inherited":       { color: "#6633bb", bg: "#ede0ff", icon: "⇑", label: "Inherited" },
              "Planned":         { color: "#8a6200", bg: "#fff3c0", icon: "◷", label: "Planned" },
              "Risk Accepted":   { color: "#6633bb", bg: "#ede0ff", icon: "⚖", label: "Risk Accepted" },
            };
            const m = statusMeta[st.status] || statusMeta["Not Implemented"];
            const ccis = getCCIs(ctrl.id);
            const selectedCCIs = st.selectedCCIs || [];
            const cciOpen = openCCI === ctrl.id;

            const affectingVulns = vulnerabilities.filter(v => {
              const sysMatch = selectedSystem === "__org__" ? true : v.systemId === selectedSystem;
              return sysMatch && (v.controls || []).includes(ctrl.id);
            });

            const openVulns   = affectingVulns.filter(v => v.status === "Open");
            const closedVulns = affectingVulns.filter(v => v.status === "Closed");

            const toggleCCI = (cci) => {
              const key = statusKey(selectedSystem, ctrl.id);
              const current = st.selectedCCIs || [];
              const next = current.includes(cci) ? current.filter(c => c !== cci) : [...current, cci];
              setControlStatuses(p => ({ ...p, [key]: { ...st, selectedCCIs: next } }));
            };

            return (
              <div key={ctrl.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${cciOpen ? "#1a3a7a" : "#c5d0de"}`, boxShadow: cciOpen ? "0 2px 12px rgba(26,58,122,0.10)" : "none", transition: "box-shadow 0.2s, border-color 0.2s" }}>

                {/* ── Main Control Row ── */}
                <div style={{
                  background: "#ffffff",
                  borderLeft: `4px solid ${m.color}`,
                  padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                }}>
                  <div style={{ minWidth: 72 }}>
                    <span style={{ color: "#1a4a8a", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 900 }}>{ctrl.id}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ color: "#0a1628", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{ctrl.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                      <Badge color="#d0f0e0" textColor="#1a7a4a" small>{ctrl.family}</Badge>
                      {ctrl.baseline.map(b => (
                        <Badge key={b} color={b==="Low"?"#e8eef6":b==="Moderate"?"#d0e5f5":"#ffe8d0"} textColor={b==="Low"?"#3a4a6b":b==="Moderate"?"#1a4a8a":"#c45200"} small>{b}</Badge>
                      ))}
                      {/* Derived badge */}
                      {st.derived && (
                        <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#6b7a99", background: "#f0f4f8", border: "1px solid #c5d0de", borderRadius: 4, padding: "1px 6px" }}>
                          auto
                        </span>
                      )}
                      {st.manuallySet && (
                        <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#1a3a7a", background: "#d0dff5", border: "1px solid #1a3a7a", borderRadius: 4, padding: "1px 6px" }}>
                          manual
                        </span>
                      )}
                    </div>
                    {/* Auto-note from findings */}
                    {st.derived && st.autoNote && (
                      <div style={{ marginTop: 4, color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace', lineHeight: 1.4" }}>
                        {st.autoNote}
                      </div>
                    )}
                    {selectedCCIs.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                        {selectedCCIs.map(c => (
                          <span key={c} style={{ background: "#1a3a7a", color: "#fff", borderRadius: 3, padding: "1px 7px", fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Finding counts */}
                  {affectingVulns.length > 0 && (
                    <div style={{ display: "flex", gap: 6 }}>
                      {openVulns.length > 0 && (
                        <div style={{ textAlign: "center", background: "#ffe0e0", border: "1px solid #cc2222", borderRadius: 6, padding: "5px 10px" }}>
                          <div style={{ color: "#cc2222", fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{openVulns.length}</div>
                          <div style={{ color: "#cc2222", fontSize: 8, fontFamily: "'DM Mono', monospace" }}>OPEN</div>
                        </div>
                      )}
                      {closedVulns.length > 0 && (
                        <div style={{ textAlign: "center", background: "#d4f5e5", border: "1px solid #1a7a4a", borderRadius: 6, padding: "5px 10px" }}>
                          <div style={{ color: "#1a7a4a", fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{closedVulns.length}</div>
                          <div style={{ color: "#1a7a4a", fontSize: 8, fontFamily: "'DM Mono', monospace" }}>CLOSED</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status pill */}
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <div style={{ background: m.bg, border: `1px solid ${m.color}`, borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: m.color, fontSize: 12 }}>{m.icon}</span>
                      <span style={{ color: m.color, fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 0.5 }}>{m.label}</span>
                    </div>
                    {st.owner && <span style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{st.owner}</span>}
                  </div>

                  {/* CCI toggle */}
                  {ccis.length > 0 && (
                    <button onClick={() => setOpenCCI(cciOpen ? null : ctrl.id)} style={{
                      background: cciOpen ? "#1a3a7a" : "#e8eef6",
                      border: `1px solid ${cciOpen ? "#1a3a7a" : "#c5d0de"}`,
                      borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s", flexShrink: 0
                    }}>
                      <span style={{ color: cciOpen ? "#fff" : "#1a3a7a", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 0.5 }}>
                        {selectedCCIs.length > 0 ? `${selectedCCIs.length}/` : ""}{ccis.length} CCI{ccis.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ color: cciOpen ? "#fff" : "#1a3a7a", fontSize: 10, display: "inline-block", transform: cciOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                    </button>
                  )}
                  {ccis.length === 0 && <span style={{ color: "#c5d0de", fontSize: 10, fontFamily: "'DM Mono', monospace", minWidth: 60 }}>No CCIs</span>}

                  <div style={{ display: "flex", gap: 6 }}>
                    {st.manuallySet && (
                      <Btn small variant="secondary" onClick={() => clearManual(ctrl.id)} style={{ fontSize: 10 }}>↺ Auto</Btn>
                    )}
                    {openVulns.length > 0 && openVulns.filter(v => !v.poamId).length > 0 && (
                      <Btn small variant="warning" onClick={() => openCtrlPoamModal(openVulns.filter(v => !v.poamId)[0], ctrl)}>📋 POAM</Btn>
                    )}
                    <Btn small variant="secondary" onClick={() => openEdit(ctrl)}>Edit</Btn>
                  </div>
                </div>

                {/* ── CCI Dropdown Panel ── */}
                {cciOpen && ccis.length > 0 && (
                  <div style={{ background: "#f7faff", borderTop: "1px solid #d0dff5" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 8px", borderBottom: "1px solid #e8eef6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#1a3a7a", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                          CONTROL CORRELATION IDENTIFIERS — {ctrl.id}
                        </span>
                        <span style={{ color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{CONTROL_FAMILIES[ctrl.family]}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {selectedCCIs.length > 0 && (
                          <button onClick={() => { const key = statusKey(selectedSystem, ctrl.id); setControlStatuses(p => ({ ...p, [key]: { ...st, selectedCCIs: [] } })); }}
                            style={{ background: "none", border: "1px solid #c5d0de", borderRadius: 6, padding: "3px 10px", color: "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: "pointer" }}>
                            Clear all
                          </button>
                        )}
                        <button onClick={() => { const key = statusKey(selectedSystem, ctrl.id); setControlStatuses(p => ({ ...p, [key]: { ...st, selectedCCIs: ccis.map(c => c.cci) } })); }}
                          style={{ background: "#d0dff5", border: "1px solid #1a3a7a", borderRadius: 6, padding: "3px 10px", color: "#1a3a7a", fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>
                          Select all
                        </button>
                        <span style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{selectedCCIs.length}/{ccis.length} selected</span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 18px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {ccis.map(({ cci, definition }, idx) => {
                        const checked = selectedCCIs.includes(cci);
                        // Check if any ingested finding references this CCI
                        const cciHasFinding = affectingVulns.some(v => (v.cciRefs || []).includes(cci));
                        return (
                          <div key={cci} onClick={() => toggleCCI(cci)} style={{
                            display: "flex", gap: 12, alignItems: "flex-start",
                            background: checked ? "#dce8f8" : cciHasFinding ? "#fffbf0" : "#ffffff",
                            border: `1px solid ${checked ? "#1a3a7a" : cciHasFinding ? "#d4a000" : "#e0e8f0"}`,
                            borderRadius: 8, padding: "10px 14px", cursor: "pointer", transition: "all 0.12s"
                          }}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, background: checked ? "#1a3a7a" : "#fff", border: `2px solid ${checked ? "#1a3a7a" : "#c5d0de"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}>
                              {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120, flexShrink: 0 }}>
                              <span style={{ color: "#8a9ab8", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")}</span>
                              <span style={{ color: checked ? "#1a3a7a" : "#1a4a8a", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, background: checked ? "#c0d4f0" : "#e8eef6", borderRadius: 4, padding: "2px 8px" }}>{cci}</span>
                              {cciHasFinding && <span style={{ fontSize: 9, color: "#a07800", fontFamily: "'DM Mono', monospace", background: "#fff3c0", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>FINDING</span>}
                            </div>
                            <div style={{ flex: 1, color: checked ? "#0a1628" : "#3a4a6b", fontSize: 12, fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>{definition}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* HEATMAP VIEW */}
      {viewMode === "heatmap" && (
        <div style={{ display: "grid", gap: 20 }}>
          {Object.entries(byFamily).map(([family, controls]) => (
            <div key={family} style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Badge color="#d0f0e0" textColor="#1a7a4a">{family}</Badge>
                <span style={{ color: "#3a4a6b", fontFamily: "'Syne', sans-serif", fontSize: 14 }}>{CONTROL_FAMILIES[family]}</span>
                <span style={{ color: "#7a8aaa", fontSize: 11, fontFamily: "'DM Mono', monospace", marginLeft: "auto" }}>{controls.length} controls</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {controls.map(ctrl => {
                  const st = getStatus(selectedSystem, ctrl.id);
                  const statusMeta = {
                    "Implemented":     { color: "#1a7a4a", bg: "#d4f5e5", icon: "✓" },
                    "Not Implemented": { color: "#cc2222", bg: "#ffe0e0", icon: "✗" },
                    "Compliant":       { color: "#1a3a7a", bg: "#d0dff5", icon: "●" },
                    "Non-Compliant":   { color: "#c45200", bg: "#ffe8d0", icon: "▲" },
                    "Not Applicable":  { color: "#6b7a99", bg: "#e8eef6", icon: "—" },
                    "Inherited":       { color: "#6633bb", bg: "#ede0ff", icon: "⇑" },
                    "Planned":         { color: "#8a6200", bg: "#fff3c0", icon: "◷" },
                    "Risk Accepted":   { color: "#6633bb", bg: "#ede0ff", icon: "⚖" },
                  };
                  const m = statusMeta[st.status] || statusMeta["Not Implemented"];
                  const affVulns = vulnerabilities.filter(v => {
                    const sysMatch = selectedSystem === "__org__" ? true : v.systemId === selectedSystem;
                    return sysMatch && (v.controls || []).includes(ctrl.id);
                  });
                  const openCount = affVulns.filter(v => v.status === "Open").length;
                  return (
                    <div key={ctrl.id} onClick={() => openEdit(ctrl)}
                      title={`${ctrl.id}: ${ctrl.title}\nStatus: ${st.status}${affVulns.length > 0 ? `\n${affVulns.length} finding(s), ${openCount} open` : ""}`}
                      style={{ background: m.bg, border: `2px solid ${m.color}`, borderRadius: 6, padding: "8px 10px", cursor: "pointer", transition: "all 0.15s", minWidth: 70, textAlign: "center", position: "relative" }}>
                      <div style={{ color: m.color, fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 900 }}>{ctrl.id}</div>
                      <div style={{ color: m.color, fontSize: 9, fontFamily: "'DM Mono', monospace", opacity: 0.8, marginTop: 2 }}>{m.icon} {st.status.split(" ")[0]}</div>
                      {openCount > 0 && (
                        <div style={{ position: "absolute", top: -6, right: -6, background: "#cc2222", color: "#fff", borderRadius: 10, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900 }}>{openCount}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingControl && (
        <Modal title={`${editingControl.id} — ${editingControl.title}`} onClose={() => setEditingControl(null)} width={680}>
          <div style={{ background: "#e8eef6", borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <Badge color="#d0f0e0" textColor="#1a7a4a">{editingControl.family} — {CONTROL_FAMILIES[editingControl.family]}</Badge>
              {editingControl.baseline.map(b => <Badge key={b} color="#d0dff5" textColor="#1a3a7a" small>{b} Baseline</Badge>)}
            </div>

            {/* Auto-derived info */}
            {editForm.derived && (
              <div style={{ background: "#fff3c0", border: "1px solid #d4a000", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
                <div style={{ color: "#8a6200", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, marginBottom: 4 }}>⚡ AUTO-DERIVED FROM INGESTED FINDINGS</div>
                <div style={{ color: "#6b5000", fontSize: 11, fontFamily: "'DM Mono', monospace", lineHeight: 1.5 }}>{editForm.autoNote}</div>
                <div style={{ color: "#8a6200", fontSize: 10, fontFamily: "'DM Mono', monospace", marginTop: 6 }}>
                  Saving will override auto-derivation. Use the ↺ Auto button on the row to revert.
                </div>
              </div>
            )}

            {/* CCI Section */}
            {(() => {
              const ccis = getCCIs(editingControl.id);
              const affVulns = vulnerabilities.filter(v =>
                (selectedSystem === "__org__" || v.systemId === selectedSystem) &&
                (v.controls || []).includes(editingControl.id)
              );
              if (ccis.length === 0) return (
                <div style={{ marginTop: 10 }}>
                  <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>CONTROL CORRELATION IDENTIFIERS (CCI)</div>
                  <div style={{ color: "#8a9ab8", fontSize: 12, fontFamily: "'DM Mono', monospace", fontStyle: "italic" }}>No CCIs mapped for this control.</div>
                </div>
              );
              return (
                <div style={{ marginTop: 12 }}>
                  <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>CONTROL CORRELATION IDENTIFIERS (CCI)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                    {ccis.map(({ cci, definition }) => {
                      const isSelected = (editForm.selectedCCIs || []).includes(cci);
                      const hasFinding = affVulns.some(v => (v.cciRefs || []).includes(cci));
                      return (
                        <div key={cci} onClick={() => { const cur = editForm.selectedCCIs || []; ef("selectedCCIs")(isSelected ? cur.filter(c => c !== cci) : [...cur, cci]); }}
                          style={{ background: isSelected ? "#d0dff5" : hasFinding ? "#fffbf0" : "#ffffff", border: `2px solid ${isSelected ? "#1a3a7a" : hasFinding ? "#d4a000" : "#c5d0de"}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", transition: "all 0.15s", display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 3, background: isSelected ? "#1a3a7a" : "#fff", border: `2px solid ${isSelected ? "#1a3a7a" : "#c5d0de"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            {isSelected && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
                          </div>
                          <div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                              <span style={{ color: "#1a3a7a", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{cci}</span>
                              {hasFinding && <span style={{ fontSize: 9, color: "#a07800", fontFamily: "'DM Mono', monospace", background: "#fff3c0", borderRadius: 3, padding: "1px 5px", fontWeight: 700 }}>FINDING</span>}
                            </div>
                            <div style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", lineHeight: 1.5 }}>{definition}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {(editForm.selectedCCIs || []).length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>SELECTED:</span>
                      {(editForm.selectedCCIs || []).map(c => <span key={c} style={{ background: "#1a3a7a", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Associated Vulnerabilities */}
            {(() => {
              const affVulns = vulnerabilities.filter(v =>
                (selectedSystem === "__org__" || v.systemId === selectedSystem) &&
                (v.controls || []).includes(editingControl.id)
              );
              return affVulns.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #c5d0de" }}>
                  <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>ASSOCIATED FINDINGS ({affVulns.length})</div>
                  {affVulns.slice(0, 8).map(v => {
                    const sev = SEVERITY_COLORS[v.severity];
                    return (
                      <div key={v.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, padding: "8px 10px", background: "#f7faff", borderRadius: 6, border: "1px solid #e8eef6" }}>
                        <Badge color={sev?.badge || sev?.bg} textColor={sev?.text} small>{v.severity}</Badge>
                        <Badge color="#e8eef6" textColor="#6b7a99" small>{v.source}</Badge>
                        {v.stigId && <span style={{ color: "#1a4a8a", fontSize: 10, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{v.stigId}</span>}
                        <span style={{ color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</span>
                        <span style={{ color: STATUS_COLORS[v.status] || "#3a4a6b", fontSize: 10, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>● {v.status}</span>
                        {!v.poamId && v.status !== "Closed" && v.status !== "False Positive" ? (
                          <button onClick={() => { setEditingControl(null); openCtrlPoamModal(v, editingControl); }} style={{ background: "#1a3a7a", color: "#fff", border: "none", borderRadius: 5, padding: "3px 9px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, cursor: "pointer", flexShrink: 0, letterSpacing: 0.3 }}>
                            📋 POAM
                          </button>
                        ) : v.poamId ? (
                          <span style={{ background: "#d4f5e5", color: "#1a7a4a", borderRadius: 4, padding: "2px 7px", fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 700, flexShrink: 0 }}>✓ POAM</span>
                        ) : null}
                      </div>
                    );
                  })}
                  {affVulns.length > 8 && <div style={{ color: "#7a8aaa", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>+{affVulns.length - 8} more findings</div>}
                </div>
              );
            })()}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#3a4a6b", fontSize: 12, marginBottom: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>OVERRIDE IMPLEMENTATION STATUS</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(CTRL_STATUS_META).map(([status, m]) => (
                <button key={status} onClick={() => ef("status")(status)} style={{
                  background: editForm.status === status ? m.bg : "#e8eef6",
                  border: `2px solid ${editForm.status === status ? m.color : "#c5d0de"}`,
                  borderRadius: 8, padding: "10px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s"
                }}>
                  <span style={{ color: m.color, fontSize: 16 }}>{m.icon}</span>
                  <span style={{ color: editForm.status === status ? m.color : "#6b7a99", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700 }}>{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="CONTROL OWNER" value={editForm.owner || ""} onChange={ef("owner")} placeholder="e.g. ISSO / John Smith" />
            <Input label="LAST REVIEWED" value={editForm.lastReviewed || ""} onChange={ef("lastReviewed")} type="date" />
          </div>
          <Textarea label="IMPLEMENTATION NOTES" value={editForm.notes || ""} onChange={ef("notes")} rows={3}
            placeholder="Describe how this control is implemented, any gaps, or why it is marked N/A..." />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setEditingControl(null)}>Cancel</Btn>
            <Btn variant="success" onClick={saveEdit}>Save Override</Btn>
          </div>
        </Modal>
      )}

      {/* ── Control POAM Creation Modal ── */}
      {ctrlPoamVuln && (
        <Modal title="Create POAM from Control Finding" onClose={() => { setCtrlPoamVuln(null); setCtrlPoamControl(null); }} width={740}>
          {/* Finding + control context banner */}
          <div style={{ background: "#f0f7ff", border: "1px solid #c0d4f0", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {(() => { const sev = SEVERITY_COLORS[ctrlPoamVuln.severity] || SEVERITY_COLORS.Info; return <Badge color={sev.badge||sev.bg} textColor={sev.text} small>{ctrlPoamVuln.severity}</Badge>; })()}
              <Badge color="#e8eef6" textColor="#3a4a6b" small>{ctrlPoamVuln.source}</Badge>
              {ctrlPoamVuln.stigId && <Badge color="#d0f0e0" textColor="#1a7a4a" small>{ctrlPoamVuln.stigId}</Badge>}
              {ctrlPoamControl && <Badge color="#d0dff5" textColor="#1a3a7a" small>Control: {ctrlPoamControl.id}</Badge>}
              {(ctrlPoamVuln.cciRefs||[]).slice(0,3).map(c => <Badge key={c} color="#d0dff5" textColor="#1a3a7a" small>{c}</Badge>)}
              {(ctrlPoamVuln.cciRefs||[]).length > 3 && <Badge color="#e8eef6" textColor="#6b7a99" small>+{ctrlPoamVuln.cciRefs.length-3} CCIs</Badge>}
            </div>
            <div style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{ctrlPoamVuln.title}</div>
            {ctrlPoamControl && <div style={{ color: "#3a4a6b", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{ctrlPoamControl.id} — {ctrlPoamControl.title}</div>}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {(ctrlPoamVuln.controls||[]).map(c => <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "1px 7px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>POAM TITLE *</label>
              <input value={ctrlPoamForm.title||""} onChange={e => cpf("title")(e.target.value)} style={{ width: "100%", background: "#fff", border: "2px solid #1a3a7a", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            <Select label="POAM TYPE" value={ctrlPoamForm.poamType||"Technical Finding"} onChange={cpf("poamType")}
              options={["Technical Finding","Operational Finding","Management Finding","Program Finding","Vulnerability"]} />
            <Select label="STATUS" value={ctrlPoamForm.status||"Open"} onChange={cpf("status")}
              options={["Open","In Progress","Completed","Risk Accepted","False Positive"]} />

            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>RESPONSIBLE POC</label>
              <input value={ctrlPoamForm.responsible||""} onChange={e => cpf("responsible")(e.target.value)} placeholder="Name / Organization" style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>SCHEDULED COMPLETION *</label>
              <input type="date" value={ctrlPoamForm.scheduledCompletion||""} onChange={e => cpf("scheduledCompletion")(e.target.value)} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>RESOURCES REQUIRED</label>
              <input value={ctrlPoamForm.resources||""} onChange={e => cpf("resources")(e.target.value)} placeholder="e.g. $5,000 / 40 hours" style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>WEAKNESS / FINDING DESCRIPTION</label>
              <textarea value={ctrlPoamForm.weaknessDesc||""} onChange={e => cpf("weaknessDesc")(e.target.value)} rows={3} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>CORRECTIVE ACTION / REMEDIATION PLAN</label>
              <textarea value={ctrlPoamForm.remediation||""} onChange={e => cpf("remediation")(e.target.value)} rows={3} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>MILESTONES</label>
              <textarea value={ctrlPoamForm.milestones||""} onChange={e => cpf("milestones")(e.target.value)} rows={4} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.8 }} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", color: "#3a4a6b", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>COMMENTS</label>
              <textarea value={ctrlPoamForm.comments||""} onChange={e => cpf("comments")(e.target.value)} rows={2} style={{ width: "100%", background: "#fff", border: "1px solid #c5d0de", borderRadius: 8, padding: "10px 14px", color: "#0a1628", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            </div>
          </div>

          <div style={{ background: "#f7faff", border: "1px solid #e0e8f0", borderRadius: 8, padding: "12px 16px", marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>NIST 800-53 CONTROLS</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(ctrlPoamVuln.controls||[]).map(c => <span key={c} style={{ background: "#d0dff5", color: "#1a3a7a", borderRadius: 3, padding: "2px 8px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{c}</span>)}
              </div>
            </div>
            {(ctrlPoamVuln.cciRefs||[]).length > 0 && (
              <div>
                <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>CCI REFERENCES</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(ctrlPoamVuln.cciRefs||[]).map(c => <span key={c} style={{ background: "#e8eef6", color: "#3a4a6b", borderRadius: 3, padding: "2px 8px", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{c}</span>)}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
            <Btn variant="secondary" onClick={() => { setCtrlPoamVuln(null); setCtrlPoamControl(null); }}>Cancel</Btn>
            <Btn onClick={confirmCtrlPoam} disabled={!ctrlPoamForm.title}>📋 Save POAM</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────── ─────────────────────────────────────────────────────────────
function Dashboard({ systems, vulnerabilities, poams }) {
  const total = vulnerabilities.length;
  const open = vulnerabilities.filter(v => v.status === "Open").length;
  const critical = vulnerabilities.filter(v => v.severity === "Critical").length;
  const high = vulnerabilities.filter(v => v.severity === "High").length;
  const withPoam = vulnerabilities.filter(v => v.poamId).length;
  const poamOpen = poams.filter(p => p.status === "Open").length;

  const controlMap = {};
  vulnerabilities.forEach(v => (v.controls || []).forEach(c => { controlMap[c] = (controlMap[c] || 0) + 1; }));
  const topControls = Object.entries(controlMap).sort((a,b) => b[1]-a[1]).slice(0, 6);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#0a1628", fontFamily: "'Syne', sans-serif", fontSize: 22, margin: 0 }}>RMF Dashboard</h2>
        <p style={{ color: "#6b7a99", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Mono', monospace" }}>Organization-wide security posture</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "SYSTEMS", value: systems.length, color: "#1a3a7a" },
          { label: "TOTAL VULNS", value: total, color: "#6633bb" },
          { label: "OPEN", value: open, color: "#cc2222" },
          { label: "CRITICAL", value: critical, color: "#bb0000" },
          { label: "HIGH", value: high, color: "#c45200" },
          { label: "POAMS", value: poams.length, color: "#8a6200" },
          { label: "OPEN POAMS", value: poamOpen, color: "#c45200" },
          { label: "POAM COVERAGE", value: total > 0 ? Math.round(withPoam / total * 100) + "%" : "—", color: "#1a7a4a" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 10, padding: 20, borderTop: `3px solid ${stat.color}` }}>
            <div style={{ color: stat.color, fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
            <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Systems list */}
        <div style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 16, marginTop: 0 }}>SYSTEMS STATUS</h3>
          {systems.length === 0 && <p style={{ color: "#8a9ab8", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No systems registered.</p>}
          {systems.map(sys => {
            const sysVulns = vulnerabilities.filter(v => v.systemId === sys.id);
            const openCount = sysVulns.filter(v => v.status === "Open").length;
            const step = RMF_STEPS.find(s => s.id === sys.rmfStep);
            return (
              <div key={sys.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #e8eef6" }}>
                <div>
                  <div style={{ color: "#0a1628", fontSize: 14, fontFamily: "'Syne', sans-serif" }}>{sys.name}</div>
                  <div style={{ color: "#6b7a99", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{step?.label} · {sys.impact} Impact</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: openCount > 0 ? "#cc2222" : "#1a7a4a", fontSize: 16, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{openCount}</div>
                  <div style={{ color: "#6b7a99", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>OPEN</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top controls affected */}
        <div style={{ background: "#ffffff", border: "1px solid #c5d0de", borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: "#3a4a6b", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, marginBottom: 16, marginTop: 0 }}>TOP CONTROLS AFFECTED</h3>
          {topControls.length === 0 && <p style={{ color: "#8a9ab8", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>No control data yet.</p>}
          {topControls.map(([ctrl, count]) => (
            <div key={ctrl} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Badge color="#ccddf5" textColor="#1a4a8a">{ctrl}</Badge>
              <div style={{ flex: 1, background: "#e8eef6", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (count / (topControls[0]?.[1] || 1)) * 100)}%`, height: "100%", background: "#1a3a7a", borderRadius: 4 }} />
              </div>
              <span style={{ color: "#3a4a6b", fontSize: 12, fontFamily: "'DM Mono', monospace", minWidth: 24 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FISMA Review Module ────────────────────────────────────────────────────
// Per FISMA 2014 (44 U.S.C. § 3551), OMB Circular A-130,
// NIST SP 800-53 Rev 5, and annual IG FISMA reporting metrics.

const FISMA_AREAS = [
  {
    id: "identify", label: "Identify", icon: "🔍", color: "#1a3a7a", bg: "#d0dff5",
    desc: "Asset management, governance, risk assessment, risk management strategy",
    metrics: [
      { id:"id-1", label:"Hardware Asset Management",       weight:8,  nist:["CM-8","PM-5"],        desc:"All hardware assets inventoried, assigned owners, and tracked." },
      { id:"id-2", label:"Software Asset Management",       weight:8,  nist:["CM-8","SA-22"],        desc:"Authorized software inventoried; unauthorized software identified and blocked." },
      { id:"id-3", label:"System Authorization (ATO)",      weight:12, nist:["CA-6","RA-3"],         desc:"All systems operate under a current, valid Authorization to Operate." },
      { id:"id-4", label:"Risk Assessment Coverage",        weight:10, nist:["RA-3","RA-5"],         desc:"Risk assessments conducted for all systems per required frequency." },
      { id:"id-5", label:"Supply Chain Risk Management",    weight:7,  nist:["SR-1","SR-3","SR-6"],  desc:"Supply chain risks identified, assessed, and managed for all acquisitions." },
      { id:"id-6", label:"Cybersecurity Policy Framework",  weight:5,  nist:["PL-1","PM-1","PM-9"],  desc:"Cybersecurity policies documented, approved, communicated, and reviewed annually." },
    ],
  },
  {
    id: "protect", label: "Protect", icon: "🛡", color: "#1a7a4a", bg: "#d4f5e5",
    desc: "Access control, awareness training, data security, configuration management, protective technology",
    metrics: [
      { id:"pr-1", label:"Identity & Access Management",    weight:12, nist:["AC-2","IA-2","IA-5"],       desc:"Privileged/non-privileged accounts managed; MFA enforced per OMB M-19-17." },
      { id:"pr-2", label:"Configuration Management",        weight:10, nist:["CM-2","CM-6","CM-7"],       desc:"STIG/CIS secure baselines applied and continuously enforced." },
      { id:"pr-3", label:"Security Awareness Training",     weight:8,  nist:["AT-2","AT-3"],              desc:"All personnel complete annual security awareness and role-based training." },
      { id:"pr-4", label:"Data Protection & Encryption",   weight:10, nist:["SC-8","SC-28","MP-5"],      desc:"Data at rest and in transit encrypted per FIPS 140-2/3; DLP controls in place." },
      { id:"pr-5", label:"Vulnerability Management",        weight:12, nist:["RA-5","SI-2","SI-5"],       desc:"Automated scanning; CAT I/II findings remediated within BOD 19-02 timelines." },
      { id:"pr-6", label:"Network Segmentation & Defense", weight:8,  nist:["SC-7","AC-17","SC-5"],      desc:"Network boundaries enforced; lateral movement restricted; DMZ implemented." },
    ],
  },
  {
    id: "detect", label: "Detect", icon: "📡", color: "#7a4a00", bg: "#fff0d0",
    desc: "Anomalies and events, continuous monitoring, detection processes",
    metrics: [
      { id:"de-1", label:"Continuous Monitoring (ConMon)",  weight:12, nist:["CA-7","SI-4","PM-31"],      desc:"ConMon program collects, analyzes, and reports security data on defined frequency." },
      { id:"de-2", label:"SIEM / Log Management",           weight:10, nist:["AU-2","AU-12","SI-4"],      desc:"Security events aggregated in SIEM; logs retained per policy; alerts tuned." },
      { id:"de-3", label:"Intrusion Detection (IDS/IPS)",   weight:8,  nist:["SI-3","SI-4","SC-35"],      desc:"IDS/IPS deployed at network boundaries and on critical hosts." },
      { id:"de-4", label:"File Integrity Monitoring",       weight:5,  nist:["SI-7","AU-2"],              desc:"FIM deployed on critical systems; unauthorized changes alerted in real time." },
    ],
  },
  {
    id: "respond", label: "Respond", icon: "🚨", color: "#8a1500", bg: "#ffe0d8",
    desc: "Response planning, communications, analysis, mitigation, improvements",
    metrics: [
      { id:"re-1", label:"Incident Response Plan",          weight:10, nist:["IR-8","IR-1","IR-9"],       desc:"IR plan documented, approved, tested annually; roles and contacts current." },
      { id:"re-2", label:"Incident Handling & US-CERT Rpt", weight:10, nist:["IR-6","IR-5","IR-4"],       desc:"Incidents detected, triaged, reported to US-CERT within required timeframes." },
      { id:"re-3", label:"POA&M Management",                weight:10, nist:["CA-5","PM-4"],              desc:"All POA&Ms tracked; milestones current; high-risk items escalated." },
    ],
  },
  {
    id: "recover", label: "Recover", icon: "♻", color: "#4a007a", bg: "#ead8ff",
    desc: "Recovery planning, improvements, communications",
    metrics: [
      { id:"rc-1", label:"Contingency Planning",            weight:8,  nist:["CP-2","CP-4","CP-9"],       desc:"Contingency plan documented, tested per BIA, and updated after each test." },
      { id:"rc-2", label:"Backup & Recovery Testing",       weight:7,  nist:["CP-9","CP-10"],             desc:"Data backed up per schedule; restoration tested and documented." },
      { id:"rc-3", label:"Business Continuity / COOP",      weight:5,  nist:["CP-2","CP-11","CP-13"],     desc:"BCP/COOP aligns with mission-critical systems; alternate sites identified." },
    ],
  },
];

const FISMA_STATUS_OPTS = [
  { value:"implemented", label:"Implemented",           color:"#1a7a4a", bg:"#d4f5e5", score:100 },
  { value:"mostly",      label:"Mostly Implemented",    color:"#5a8a2a", bg:"#e4f5d0", score:75  },
  { value:"partial",     label:"Partially Implemented", color:"#a07800", bg:"#fff3c0", score:50  },
  { value:"planned",     label:"Planned",               color:"#c45200", bg:"#ffe8d0", score:25  },
  { value:"not",         label:"Not Implemented",       color:"#cc2222", bg:"#ffe0e0", score:0   },
  { value:"na",          label:"Not Applicable",        color:"#6b7a99", bg:"#e8eef6", score:100 },
];

const FISMA_GRADES = [
  { min:90, grade:"A", label:"Strong",     color:"#1a7a4a", bg:"#d4f5e5" },
  { min:80, grade:"B", label:"Adequate",   color:"#5a8a2a", bg:"#e4f5d0" },
  { min:70, grade:"C", label:"Moderate",   color:"#a07800", bg:"#fff3c0" },
  { min:60, grade:"D", label:"Weak",       color:"#c45200", bg:"#ffe8d0" },
  { min:0,  grade:"F", label:"Inadequate", color:"#cc2222", bg:"#ffe0e0" },
];

function getGrade(score) {
  if (score === null || score === undefined) return null;
  return FISMA_GRADES.find(g => score >= g.min) || FISMA_GRADES[FISMA_GRADES.length - 1];
}

function FismaView({ systems, vulnerabilities, poams, controlStatuses, defaultSystemId }) {
  const [selSys,     setSelSys]     = useState(defaultSystemId || "__org__");
  useEffect(() => { if (defaultSystemId) setSelSys(defaultSystemId); }, [defaultSystemId]);
  const [selFY,      setSelFY]      = useState("FY2026");
  const [scores,     setScores]     = useState({});
  const [activeArea, setActiveArea] = useState("identify");
  const [viewMode,   setViewMode]   = useState("scorecard");
  const [editCell,   setEditCell]   = useState(null);
  const [cellForm,   setCellForm]   = useState({});
  const [generated,  setGenerated]  = useState(null);
  const [reportMeta, setReportMeta] = useState({
    org:"", reviewer:"", reviewerTitle:"", ciso:"", date:today(),
    nextReview:"", scope:"", findings:"", recommendations:"",
  });
  const rm = k => v => setReportMeta(p => ({ ...p, [k]: v }));
  const cf = k => v => setCellForm(p => ({ ...p, [k]: v }));

  const sys        = selSys === "__org__" ? null : systems.find(s => s.id === selSys);
  const scopeLabel = sys ? sys.name : "Organization-Wide";

  // ── Key per FY + scope + metric ──────────────────────────────────────
  const key     = mid => `${selFY}::${selSys}::${mid}`;
  const getCell = mid  => scores[key(mid)] || { status:"", notes:"", evidence:"", reviewer:"" };
  const setCell = (mid, data) => setScores(p => ({ ...p, [key(mid)]: { ...getCell(mid), ...data } }));

  // ── Auto-derive from app data ─────────────────────────────────────────
  const autoDeriveScores = () => {
    const sv = selSys === "__org__" ? vulnerabilities : vulnerabilities.filter(v => v.systemId === selSys);
    const sp = selSys === "__org__" ? poams           : poams.filter(p => p.systemId === selSys);
    const cs = Object.entries(controlStatuses)
      .filter(([k]) => selSys === "__org__" || k.startsWith(selSys + "::"))
      .map(([, v]) => v);

    const openCrit     = sv.filter(v => v.status === "Open" && ["Critical","High"].includes(v.severity)).length;
    const openTotal    = sv.filter(v => v.status === "Open").length;
    const overduePoams = sp.filter(p => p.scheduledCompletion && p.status !== "Completed" && new Date(p.scheduledCompletion) < new Date()).length;
    const implPct      = cs.length === 0 ? 0 : Math.round(cs.filter(c => ["Implemented","Compliant","Inherited"].includes(c.status)).length / cs.length * 100);
    const atoOk        = selSys === "__org__"
      ? systems.length > 0 && systems.every(s => s.atoDate && new Date(s.atoDate) > new Date())
      : sys ? (sys.atoDate && new Date(sys.atoDate) > new Date()) : false;

    const derived = {
      "id-3": { status: atoOk ? "implemented" : "not",
                notes: atoOk ? "All systems have a current valid ATO." : "One or more systems lack a valid ATO — immediate remediation required." },
      "id-4": { status: sv.length > 0 ? (openCrit > 0 ? "partial" : "mostly") : "planned",
                notes: `${sv.length} total findings ingested; ${openCrit} Critical/High open; ${openTotal} open total.` },
      "pr-2": { status: implPct >= 80 ? "implemented" : implPct >= 60 ? "mostly" : implPct >= 40 ? "partial" : "planned",
                notes: `${implPct}% of tracked controls are implemented or compliant per control baseline.` },
      "pr-5": { status: openCrit === 0 ? "implemented" : openCrit <= 5 ? "mostly" : openCrit <= 15 ? "partial" : "not",
                notes: `${openTotal} open vulnerabilities; ${openCrit} Critical/High requiring priority remediation per BOD 19-02.` },
      "re-3": { status: sp.length === 0 ? "planned" : overduePoams === 0 ? "implemented" : overduePoams <= 2 ? "mostly" : overduePoams <= 5 ? "partial" : "not",
                notes: `${sp.length} total POA&Ms; ${overduePoams} overdue milestone${overduePoams !== 1 ? "s" : ""}.` },
    };
    Object.entries(derived).forEach(([mid, d]) =>
      setCell(mid, { ...d, autoderived: true })
    );
  };

  // ── Score calculations ────────────────────────────────────────────────
  const calcArea = area => {
    let tw = 0, ew = 0;
    area.metrics.forEach(m => {
      const opt = FISMA_STATUS_OPTS.find(o => o.value === getCell(m.id).status);
      if (opt) { ew += m.weight * opt.score / 100; tw += m.weight; }
    });
    return tw === 0 ? null : Math.round(ew / tw * 100);
  };

  const calcOverall = () => {
    let tw = 0, ew = 0;
    FISMA_AREAS.forEach(area => area.metrics.forEach(m => {
      const opt = FISMA_STATUS_OPTS.find(o => o.value === getCell(m.id).status);
      if (opt) { ew += m.weight * opt.score / 100; tw += m.weight; }
    }));
    return tw === 0 ? null : Math.round(ew / tw * 100);
  };

  const overallScore = calcOverall();
  const overallGrade = getGrade(overallScore);
  const allMetrics   = FISMA_AREAS.flatMap(a => a.metrics);
  const scoredCount  = allMetrics.filter(m => getCell(m.id).status).length;
  const totalMetrics = allMetrics.length;

  // ── Edit modal ────────────────────────────────────────────────────────
  const openEdit = metric => { setCellForm({ ...getCell(metric.id), metricId: metric.id }); setEditCell(metric.id); };
  const saveCell = () => { setCell(cellForm.metricId, { status:cellForm.status, notes:cellForm.notes, evidence:cellForm.evidence, reviewer:cellForm.reviewer, autoderived:false }); setEditCell(null); };

  // ── Generate report snapshot ──────────────────────────────────────────
  const generateReport = () => {
    setGenerated({
      meta:          { ...reportMeta },
      selFY, scopeLabel,
      sys:           sys ? { ...sys } : null,
      overallScore, overallGrade,
      areaResults:   FISMA_AREAS.map(a => ({ ...a, score: calcArea(a), metrics: a.metrics.map(m => ({ ...m, cell: getCell(m.id) })) })),
      scoredCount, totalMetrics,
      generatedAt:   new Date().toLocaleString(),
      openVulns:     (selSys === "__org__" ? vulnerabilities : vulnerabilities.filter(v => v.systemId === selSys)).filter(v => v.status === "Open").length,
      poamCount:     (selSys === "__org__" ? poams           : poams.filter(p => p.systemId === selSys)).length,
      overduePoams:  (selSys === "__org__" ? poams           : poams.filter(p => p.systemId === selSys)).filter(p => p.scheduledCompletion && p.status !== "Completed" && new Date(p.scheduledCompletion) < new Date()).length,
    });
    setViewMode("report");
  };

  // ── Print ─────────────────────────────────────────────────────────────
  const printReport = () => {
    const el = document.getElementById("fisma-print-area");
    if (!el) return;
    const win = window.open("", "_blank", "width=1050,height=800");
    win.document.write(`<html><head><title>FISMA Review</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500;700&display=swap">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Mono',monospace;color:#0a1628;background:#fff;padding:32px;font-size:11px}
        h1{font-family:'Syne',sans-serif;font-size:24px;margin-bottom:6px}
        h2{font-family:'Syne',sans-serif;font-size:15px;color:#1a3a7a;border-bottom:2px solid #1a3a7a;padding-bottom:5px;margin:22px 0 12px}
        p{line-height:1.75;margin-bottom:10px;color:#3a4a6b;font-size:11px}
        .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
        .grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
        .meta{background:#e8eef6;border-radius:6px;padding:9px 13px}
        .lbl{font-size:8px;letter-spacing:1px;color:#6b7a99;text-transform:uppercase;margin-bottom:3px}
        .area-card{border:1px solid #c5d0de;border-radius:8px;margin-bottom:12px;overflow:hidden}
        .area-hdr{padding:9px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #e8eef6}
        .mrow{padding:8px 16px;border-top:1px solid #f0f4f8;display:grid;grid-template-columns:2fr 1fr 2fr;gap:12px}
        .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:9px;font-weight:700}
        .ctrl{background:#d0dff5;color:#1a3a7a;border-radius:3px;padding:1px 6px;font-size:8px;font-weight:700;display:inline-block;margin:1px}
        .footer{border-top:2px solid #1a3a7a;padding-top:12px;margin-top:22px;color:#8a9ab8;font-size:9px;display:flex;justify-content:space-between;align-items:flex-end}
        @media print{body{padding:16px}@page{margin:12mm;size:letter}}
      </style></head><body>${el.innerHTML}</body></html>`);
    win.document.close(); win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:22, margin:0 }}>FISMA Review</h2>
          <p style={{ color:"#6b7a99", fontSize:13, margin:"4px 0 0", fontFamily:"'DM Mono', monospace" }}>
            Federal Information Security Modernization Act · NIST CSF · OMB Circular A-130 · NIST SP 800-53 Rev 5
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[
            { id:"scorecard", icon:"📋", label:"Scorecard" },
            { id:"summary",   icon:"⊞",  label:"Summary"   },
            { id:"report",    icon:"📄", label:"Report"    },
          ].map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)} style={{
              background: viewMode===m.id ? "#1a3a7a" : "#e8eef6",
              color:      viewMode===m.id ? "#fff"    : "#3a4a6b",
              border:"none", borderRadius:8, padding:"9px 18px",
              fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700, cursor:"pointer",
            }}>{m.icon} {m.label}</button>
          ))}
        </div>
      </div>

      {/* Config bar */}
      <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:18, marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:14 }}>
          {[
            { label:"SCOPE", content:
              <select value={selSys} onChange={e => setSelSys(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                <option value="__org__">Organization-Wide</option>
                {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select> },
            { label:"FISCAL YEAR", content:
              <select value={selFY} onChange={e => setSelFY(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                {["FY2026","FY2025","FY2024","FY2023"].map(fy => <option key={fy}>{fy}</option>)}
              </select> },
            { label:"REVIEWER", content:
              <input value={reportMeta.reviewer} onChange={e => rm("reviewer")(e.target.value)} placeholder="Name / title"
                style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} /> },
            { label:"REVIEW DATE", content:
              <input type="date" value={reportMeta.date} onChange={e => rm("date")(e.target.value)}
                style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} /> },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:5 }}>{f.label}</label>
              {f.content}
            </div>
          ))}
        </div>

        {/* Optional narrative fields */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          {[
            { key:"findings",        label:"KEY FINDINGS",        ph:"Summarize the most significant security gaps found during this review..." },
            { key:"recommendations", label:"RECOMMENDATIONS",     ph:"List priority corrective actions and strategic improvements..." },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:5 }}>{f.label}</label>
              <textarea value={reportMeta[f.key]} onChange={e => rm(f.key)(e.target.value)} placeholder={f.ph} rows={2}
                style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:11, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.5 }} />
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <Btn variant="secondary" onClick={autoDeriveScores}>⚡ Auto-Score from App Data</Btn>
          <Btn onClick={generateReport} disabled={scoredCount === 0} style={{ background:"#1a7a4a", borderColor:"#1a7a4a" }}>📄 Generate FISMA Report</Btn>
          <div style={{ flex:1 }} />
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"#e8eef6", borderRadius:6, height:7, width:150, overflow:"hidden" }}>
              <div style={{ width:`${(scoredCount/totalMetrics)*100}%`, height:"100%", background:"#1a3a7a", borderRadius:6, transition:"width 0.4s" }} />
            </div>
            <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{scoredCount}/{totalMetrics} scored</span>
          </div>
        </div>
      </div>

      {/* Overall score banner — shown in all views once any scoring done */}
      {overallScore !== null && (
        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          {/* Main grade tile */}
          <div style={{ background:overallGrade.bg, border:`2px solid ${overallGrade.color}`, borderRadius:12, padding:"16px 24px", display:"flex", alignItems:"center", gap:20, flex:1, minWidth:260 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", border:`4px solid ${overallGrade.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", flexShrink:0 }}>
              <div style={{ color:overallGrade.color, fontFamily:"'Syne', sans-serif", fontSize:28, fontWeight:900, lineHeight:1 }}>{overallGrade.grade}</div>
              <div style={{ color:overallGrade.color, fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:1 }}>{overallScore}%</div>
            </div>
            <div>
              <div style={{ color:overallGrade.color, fontFamily:"'Syne', sans-serif", fontSize:17, fontWeight:900 }}>{overallGrade.label} Security Posture</div>
              <div style={{ color:overallGrade.color, fontSize:11, fontFamily:"'DM Mono', monospace", marginTop:3, lineHeight:1.5 }}>
                {scopeLabel} · {selFY}<br/>{scoredCount}/{totalMetrics} metrics scored
              </div>
            </div>
          </div>
          {/* Per-area mini tiles */}
          {FISMA_AREAS.map(area => {
            const aScore = calcArea(area);
            const ag     = getGrade(aScore);
            return (
              <div key={area.id} onClick={() => { setActiveArea(area.id); setViewMode("scorecard"); }}
                style={{ background: ag ? ag.bg : "#e8eef6", border:`1px solid ${ag ? ag.color : "#c5d0de"}`, borderRadius:10, padding:"12px 16px", textAlign:"center", minWidth:86, cursor:"pointer", transition:"transform 0.1s" }}>
                <div style={{ fontSize:20, marginBottom:3 }}>{area.icon}</div>
                <div style={{ color: ag ? ag.color : "#8a9ab8", fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:900 }}>{aScore !== null ? aScore+"%" : "—"}</div>
                <div style={{ color: ag ? ag.color : "#8a9ab8", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:0.5, marginTop:1 }}>{area.label.toUpperCase()}</div>
                {ag && <div style={{ color:ag.color, fontSize:9, fontFamily:"'DM Mono', monospace" }}>{ag.grade}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════ SCORECARD VIEW ════════════════════════════ */}
      {viewMode === "scorecard" && (
        <div>
          {/* Area tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
            {FISMA_AREAS.map(area => {
              const aScore = calcArea(area);
              const ag     = getGrade(aScore);
              const active = activeArea === area.id;
              return (
                <button key={area.id} onClick={() => setActiveArea(area.id)} style={{
                  background: active ? area.color : "#e8eef6",
                  color:      active ? "#fff"     : "#3a4a6b",
                  border: active ? "none" : "1px solid #c5d0de",
                  borderRadius:8, padding:"8px 16px", cursor:"pointer",
                  fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700,
                  display:"flex", alignItems:"center", gap:7,
                }}>
                  <span>{area.icon}</span>
                  <span>{area.label}</span>
                  {aScore !== null && (
                    <span style={{ background: active ? "rgba(255,255,255,0.22)" : (ag ? ag.bg : "#e8eef6"),
                      color: active ? "#fff" : (ag ? ag.color : "#8a9ab8"),
                      borderRadius:10, padding:"1px 8px", fontSize:10, fontWeight:900 }}>
                      {aScore}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Metrics for active area */}
          {FISMA_AREAS.filter(a => a.id === activeArea).map(area => (
            <div key={area.id} style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, overflow:"hidden" }}>
              {/* Area header */}
              <div style={{ background:area.bg, borderBottom:"1px solid #e8eef6", padding:"14px 22px", display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:24 }}>{area.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:area.color, fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900 }}>{area.label}</div>
                  <div style={{ color:area.color, fontSize:11, fontFamily:"'DM Mono', monospace", opacity:0.85, marginTop:2 }}>{area.desc}</div>
                </div>
                {calcArea(area) !== null && (() => {
                  const ag = getGrade(calcArea(area));
                  return (
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:area.color, fontFamily:"'Syne', sans-serif", fontSize:30, fontWeight:900, lineHeight:1 }}>{calcArea(area)}%</div>
                      {ag && <div style={{ color:ag.color, background:ag.bg, display:"inline-block", borderRadius:6, padding:"2px 10px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, marginTop:4 }}>{ag.grade} — {ag.label}</div>}
                    </div>
                  );
                })()}
              </div>

              {/* Metric rows */}
              {area.metrics.map((metric, idx) => {
                const cell = getCell(metric.id);
                const opt  = FISMA_STATUS_OPTS.find(o => o.value === cell.status);
                return (
                  <div key={metric.id} style={{ borderBottom: idx < area.metrics.length-1 ? "1px solid #f0f4f8" : "none", padding:"18px 22px" }}>
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                      {/* Status indicator */}
                      <div style={{ width:52, height:52, borderRadius:10, flexShrink:0,
                        background: opt ? opt.bg : "#f0f4f8",
                        border: `2px solid ${opt ? opt.color : "#c5d0de"}`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                        <div style={{ color: opt ? opt.color : "#8a9ab8", fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:900 }}>
                          {opt ? (opt.score === 100 ? "✓" : opt.score === 0 ? "✗" : opt.score+"%") : "—"}
                        </div>
                        {opt && <div style={{ color:opt.color, fontSize:7, fontFamily:"'DM Mono', monospace", marginTop:1 }}>SCORE</div>}
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        {/* Title row */}
                        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                          <span style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:700 }}>{metric.label}</span>
                          <span style={{ color:"#8a9ab8", fontSize:9, fontFamily:"'DM Mono', monospace", background:"#e8eef6", borderRadius:3, padding:"1px 6px" }}>{metric.id.toUpperCase()}</span>
                          {opt && <span style={{ background:opt.bg, color:opt.color, border:`1px solid ${opt.color}`, borderRadius:10, padding:"2px 10px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{opt.label}</span>}
                          {cell.autoderived && <span style={{ background:"#d4f5e5", color:"#1a7a4a", borderRadius:3, padding:"1px 7px", fontSize:9, fontFamily:"'DM Mono', monospace" }}>⚡ auto-scored</span>}
                          <span style={{ color:"#c5d0de", fontSize:10, fontFamily:"'DM Mono', monospace", marginLeft:"auto" }}>Wt: {metric.weight}</span>
                        </div>

                        {/* Description */}
                        <div style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", lineHeight:1.5, marginBottom:7 }}>{metric.desc}</div>

                        {/* NIST controls */}
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom: cell.notes ? 8 : 0 }}>
                          {metric.nist.map(c => <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a", borderRadius:3, padding:"1px 8px", fontSize:9, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>)}
                        </div>

                        {/* Notes / evidence */}
                        {cell.notes && (
                          <div style={{ background:"#f7faff", border:"1px solid #dce8f5", borderRadius:6, padding:"8px 12px", fontSize:11, fontFamily:"'DM Mono', monospace", color:"#3a4a6b", lineHeight:1.6, marginTop:2 }}>
                            📝 {cell.notes}
                          </div>
                        )}
                        {cell.evidence && (
                          <div style={{ marginTop:5, fontSize:10, fontFamily:"'DM Mono', monospace", color:"#6b7a99" }}>
                            📎 Evidence: <span style={{ color:"#3a4a6b" }}>{cell.evidence}</span>
                          </div>
                        )}
                        {cell.reviewer && (
                          <div style={{ marginTop:3, fontSize:10, fontFamily:"'DM Mono', monospace", color:"#8a9ab8" }}>
                            Reviewer: {cell.reviewer}
                          </div>
                        )}
                      </div>

                      <Btn small variant="secondary" onClick={() => openEdit(metric)}>✎ Score</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════ SUMMARY VIEW ══════════════════════════════ */}
      {viewMode === "summary" && (
        <div style={{ display:"grid", gap:14 }}>
          {FISMA_AREAS.map(area => {
            const aScore = calcArea(area);
            const ag     = getGrade(aScore);
            const gaps   = area.metrics.filter(m => ["not","planned","partial"].includes(getCell(m.id).status));
            const scored = area.metrics.filter(m => getCell(m.id).status).length;
            return (
              <div key={area.id} style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, overflow:"hidden" }}>
                {/* Area header */}
                <div style={{ background:area.bg, padding:"12px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #e8eef6", cursor:"pointer" }}
                  onClick={() => { setActiveArea(area.id); setViewMode("scorecard"); }}>
                  <span style={{ fontSize:20 }}>{area.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ color:area.color, fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:900 }}>{area.label}</div>
                    <div style={{ color:area.color, fontSize:10, fontFamily:"'DM Mono', monospace", opacity:0.8 }}>{scored}/{area.metrics.length} metrics scored · click to detail</div>
                  </div>
                  {aScore !== null && ag && (
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ background:"rgba(255,255,255,0.6)", borderRadius:6, height:10, width:130, overflow:"hidden" }}>
                        <div style={{ width:`${aScore}%`, height:"100%", background:ag.color, borderRadius:6, transition:"width 0.4s" }} />
                      </div>
                      <div style={{ color:ag.color, fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:900, minWidth:54 }}>{aScore}%</div>
                      <div style={{ background:ag.bg, color:ag.color, border:`1px solid ${ag.color}`, borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{ag.grade}</div>
                    </div>
                  )}
                </div>

                {/* Metric grid */}
                <div style={{ padding:"10px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                  {area.metrics.map(m => {
                    const opt = FISMA_STATUS_OPTS.find(o => o.value === getCell(m.id).status);
                    return (
                      <div key={m.id} style={{ display:"flex", gap:8, alignItems:"center", padding:"7px 0", borderBottom:"1px solid #f4f6f9" }}>
                        <div style={{ width:9, height:9, borderRadius:"50%", background: opt ? opt.color : "#d0d8e4", flexShrink:0 }} />
                        <span style={{ color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", flex:1 }}>{m.label}</span>
                        {opt
                          ? <span style={{ color:opt.color, fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{opt.score}%</span>
                          : <span style={{ color:"#c5d0de", fontSize:10, fontFamily:"'DM Mono', monospace" }}>—</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Gaps callout */}
                {gaps.length > 0 && (
                  <div style={{ background:"#fff8f2", borderTop:"1px solid #f0d8c0", padding:"10px 20px" }}>
                    <div style={{ color:"#c45200", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, letterSpacing:1, marginBottom:6 }}>⚠ {gaps.length} GAP{gaps.length!==1?"S":""} IDENTIFIED</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {gaps.map(m => {
                        const opt = FISMA_STATUS_OPTS.find(o => o.value === getCell(m.id).status);
                        return <span key={m.id} style={{ background:opt?.bg||"#e8eef6", color:opt?.color||"#3a4a6b", border:`1px solid ${opt?.color||"#c5d0de"}`, borderRadius:5, padding:"3px 10px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{m.label}</span>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════ REPORT VIEW ════════════════════════════════ */}
      {viewMode === "report" && (
        <div>
          {!generated && (
            <div style={{ background:"#fff8e8", border:"1px solid #e8c840", borderRadius:12, padding:40, textAlign:"center" }}>
              <div style={{ fontSize:44, marginBottom:14 }}>📋</div>
              <div style={{ color:"#6b4e00", fontFamily:"'DM Mono', monospace", fontSize:14, fontWeight:700, marginBottom:8 }}>FISMA Annual Review Report Not Yet Generated</div>
              <div style={{ color:"#8a7040", fontFamily:"'DM Mono', monospace", fontSize:12, marginBottom:22 }}>
                Score your metrics in the Scorecard, fill in review details above, then click <strong>Generate FISMA Report</strong>.
              </div>
              <Btn onClick={generateReport} disabled={scoredCount === 0}>📄 Generate Report Now</Btn>
            </div>
          )}

          {generated && (
            <div>
              {/* Toolbar */}
              <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", background:"#f0f7ff", border:"1px solid #c0d4f0", borderRadius:10, padding:"12px 16px" }}>
                <span style={{ color:"#1a3a7a", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700, flex:1 }}>
                  ✓ FISMA Report generated {generated.generatedAt}
                </span>
                <Btn small variant="secondary" onClick={generateReport}>↺ Regenerate</Btn>
                <Btn small onClick={printReport}>🖨 Print / Export PDF</Btn>
              </div>

              {/* ── PRINTABLE DOCUMENT ── */}
              <div id="fisma-print-area" style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:"44px 52px", lineHeight:1.75 }}>

                {/* Cover */}
                <div style={{ borderBottom:"3px solid #1a3a7a", paddingBottom:32, marginBottom:32 }}>
                  <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:3, marginBottom:10, textTransform:"uppercase" }}>
                    FISMA Annual Review Report
                  </div>
                  <h1 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:28, margin:"0 0 6px", lineHeight:1.2 }}>
                    {generated.selFY} FISMA Review — {generated.scopeLabel}
                  </h1>
                  <div style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:18 }}>
                    Federal Information Security Modernization Act · OMB Circular A-130 · NIST SP 800-53 Rev 5
                  </div>

                  {/* Overall grade badge */}
                  {generated.overallGrade && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:18,
                      background:generated.overallGrade.bg, border:`2px solid ${generated.overallGrade.color}`,
                      borderRadius:12, padding:"14px 26px", marginBottom:24 }}>
                      <div style={{ width:60, height:60, borderRadius:"50%", border:`3px solid ${generated.overallGrade.color}`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                        <div style={{ color:generated.overallGrade.color, fontFamily:"'Syne', sans-serif", fontSize:24, fontWeight:900 }}>{generated.overallGrade.grade}</div>
                      </div>
                      <div>
                        <div style={{ color:generated.overallGrade.color, fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:900 }}>
                          {generated.overallScore}% — {generated.overallGrade.label}
                        </div>
                        <div style={{ color:generated.overallGrade.color, fontSize:11, fontFamily:"'DM Mono', monospace", marginTop:2 }}>
                          Overall FISMA Compliance Score · {generated.scoredCount}/{generated.totalMetrics} metrics scored
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata grid */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {[
                      ["Scope",             generated.scopeLabel],
                      ["Fiscal Year",       generated.selFY],
                      ["Reviewer",          generated.meta.reviewer || "—"],
                      ["Review Date",       generated.meta.date     || today()],
                      ["Open Vulns",        String(generated.openVulns)],
                      ["Active POA&Ms",     String(generated.poamCount)],
                      ["Overdue POA&Ms",    String(generated.overduePoams)],
                      ["Metrics Scored",    `${generated.scoredCount}/${generated.totalMetrics}`],
                    ].map(([l,v]) => (
                      <div key={l} style={{ background:"#e8eef6", borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:3 }}>{l.toUpperCase()}</div>
                        <div style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Executive Summary */}
                <div style={{ marginBottom:30 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:7, marginBottom:14 }}>
                    1. Executive Summary
                  </div>
                  <p style={{ color:"#3a4a6b", fontSize:13, fontFamily:"'DM Mono', monospace", lineHeight:1.8, margin:"0 0 12px" }}>
                    This report presents the {generated.selFY} FISMA Annual Review for <strong>{generated.scopeLabel}</strong>,
                    conducted in accordance with the Federal Information Security Modernization Act of 2014
                    (44 U.S.C. § 3551 et seq.), OMB Circular A-130 (Managing Information as a Strategic Resource),
                    and NIST Special Publication 800-53 Revision 5. The review evaluates security posture across
                    the five NIST Cybersecurity Framework functions: Identify, Protect, Detect, Respond, and Recover.
                  </p>
                  {generated.meta.findings && (
                    <div style={{ background:"#fff8f0", border:"1px solid #f0d0a0", borderRadius:8, padding:"12px 18px", marginBottom:12 }}>
                      <div style={{ color:"#8a5000", fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>KEY FINDINGS</div>
                      <p style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", lineHeight:1.7, margin:0 }}>{generated.meta.findings}</p>
                    </div>
                  )}
                  {generated.meta.recommendations && (
                    <div style={{ background:"#f0f8f0", border:"1px solid #b0e0b0", borderRadius:8, padding:"12px 18px" }}>
                      <div style={{ color:"#1a7a4a", fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>RECOMMENDATIONS</div>
                      <p style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", lineHeight:1.7, margin:0 }}>{generated.meta.recommendations}</p>
                    </div>
                  )}
                </div>

                {/* 2. Domain Scores */}
                <div style={{ marginBottom:30 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:7, marginBottom:14 }}>
                    2. FISMA Domain Scores (NIST CSF)
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
                    {generated.areaResults.map(area => {
                      const ag = getGrade(area.score);
                      return (
                        <div key={area.id} style={{ background: ag ? ag.bg : "#e8eef6", border:`2px solid ${ag ? ag.color : "#c5d0de"}`, borderRadius:10, padding:"14px 10px", textAlign:"center" }}>
                          <div style={{ fontSize:24, marginBottom:4 }}>{area.icon}</div>
                          <div style={{ color: ag ? ag.color : "#8a9ab8", fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:900 }}>{area.score !== null ? area.score+"%" : "—"}</div>
                          <div style={{ color: ag ? ag.color : "#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, marginTop:2 }}>{area.label}</div>
                          {ag && <div style={{ color:ag.color, fontSize:9, fontFamily:"'DM Mono', monospace", marginTop:2 }}>{ag.grade} · {ag.label}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Detailed Metric Assessment */}
                <div style={{ marginBottom:30 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:7, marginBottom:14 }}>
                    3. Detailed Metric Assessment
                  </div>
                  {generated.areaResults.map(area => {
                    const ag = getGrade(area.score);
                    return (
                      <div key={area.id} style={{ marginBottom:18, border:"1px solid #c5d0de", borderRadius:10, overflow:"hidden" }}>
                        <div style={{ background:area.bg, padding:"10px 18px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #e8eef6" }}>
                          <span style={{ fontSize:18 }}>{area.icon}</span>
                          <span style={{ color:area.color, fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:900, flex:1 }}>{area.label}</span>
                          {area.score !== null && ag && (
                            <span style={{ color:ag.color, fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900 }}>{area.score}% — Grade {ag.grade}</span>
                          )}
                        </div>
                        {area.metrics.map((m, idx) => {
                          const opt = FISMA_STATUS_OPTS.find(o => o.value === m.cell.status);
                          return (
                            <div key={m.id} style={{ padding:"10px 18px", borderBottom: idx < area.metrics.length-1 ? "1px solid #f0f4f8" : "none",
                              display:"grid", gridTemplateColumns:"2fr 1fr 2fr", gap:14, alignItems:"start" }}>
                              <div>
                                <div style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700, marginBottom:4 }}>{m.label}</div>
                                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                  {m.nist.map(c => <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a", borderRadius:3, padding:"1px 6px", fontSize:9, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>)}
                                </div>
                              </div>
                              <div>
                                {opt
                                  ? <span style={{ background:opt.bg, color:opt.color, border:`1px solid ${opt.color}`, borderRadius:6, padding:"3px 10px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700, display:"inline-block" }}>{opt.label}</span>
                                  : <span style={{ color:"#c5d0de", fontSize:11 }}>Not Scored</span>}
                              </div>
                              <div>
                                {m.cell.notes && <div style={{ color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", lineHeight:1.55 }}>{m.cell.notes}</div>}
                                {m.cell.evidence && <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:4 }}>📎 {m.cell.evidence}</div>}
                                {m.cell.reviewer && <div style={{ color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:3 }}>Reviewer: {m.cell.reviewer}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* 4. Gap Analysis */}
                <div style={{ marginBottom:30 }}>
                  <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, borderBottom:"2px solid #1a3a7a", paddingBottom:7, marginBottom:14 }}>
                    4. Gap Analysis &amp; Corrective Action Plan
                  </div>
                  {(() => {
                    const gaps = generated.areaResults.flatMap(area =>
                      area.metrics
                        .filter(m => ["not","planned","partial"].includes(m.cell.status))
                        .map(m => ({ ...m, areaLabel:area.label, areaIcon:area.icon, areaColor:area.color }))
                    );
                    if (!gaps.length) return (
                      <div style={{ background:"#d4f5e5", border:"1px solid #1a7a4a", borderRadius:8, padding:"14px 20px", color:"#1a7a4a", fontFamily:"'DM Mono', monospace", fontSize:13 }}>
                        ✓ No gaps identified — all scored metrics are Implemented or Mostly Implemented.
                      </div>
                    );
                    return gaps.map((m, i) => {
                      const opt = FISMA_STATUS_OPTS.find(o => o.value === m.cell.status);
                      return (
                        <div key={m.id} style={{ border:`1px solid ${opt?.color||"#c5d0de"}`, borderRadius:8, marginBottom:10, overflow:"hidden" }}>
                          <div style={{ background:opt?.bg||"#e8eef6", padding:"8px 16px", display:"flex", gap:10, alignItems:"center" }}>
                            <span style={{ color:"#6b7a99", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700, minWidth:28 }}>G{String(i+1).padStart(2,"0")}</span>
                            <span style={{ fontSize:14 }}>{m.areaIcon}</span>
                            <span style={{ color:m.areaColor, fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{m.areaLabel}</span>
                            <span style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700, flex:1 }}>{m.label}</span>
                            {opt && <span style={{ color:opt.color, fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{opt.label}</span>}
                          </div>
                          <div style={{ padding:"10px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:4 }}>FINDING / CURRENT STATE</div>
                              <div style={{ color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", lineHeight:1.55 }}>{m.cell.notes || m.desc}</div>
                            </div>
                            <div>
                              <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:4 }}>NIST 800-53 CONTROLS</div>
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                {m.nist.map(c => <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a", borderRadius:3, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Footer */}
                <div style={{ borderTop:"2px solid #1a3a7a", paddingTop:14, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                  <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace", lineHeight:1.7 }}>
                    Generated: {generated.generatedAt}<br/>
                    Authority: FISMA 2014 (44 U.S.C. § 3551) · OMB Circular A-130 · NIST SP 800-53 Rev 5<br/>
                    {generated.meta.reviewer ? `Reviewer: ${generated.meta.reviewer}` : ""}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:14, fontWeight:900 }}>RMF TRACKER</div>
                    <div style={{ color:"#7caadf", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:2 }}>NIST 800-53 REV 5</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Score Metric Modal ── */}
      {editCell && (() => {
        const metric = FISMA_AREAS.flatMap(a => a.metrics).find(m => m.id === editCell);
        if (!metric) return null;
        const area   = FISMA_AREAS.find(a => a.metrics.some(m => m.id === editCell));
        return (
          <Modal title={`Score: ${metric.label}`} onClose={() => setEditCell(null)} width={680}>
            {/* Context */}
            <div style={{ background: area.bg, border:`1px solid ${area.color}`, borderRadius:8, padding:"10px 16px", marginBottom:18 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:16 }}>{area.icon}</span>
                <span style={{ color:area.color, fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{area.label}</span>
                <span style={{ background:"#e8eef6", color:"#6b7a99", borderRadius:3, padding:"1px 6px", fontSize:9, fontFamily:"'DM Mono', monospace" }}>{metric.id.toUpperCase()}</span>
              </div>
              <div style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", lineHeight:1.5, marginBottom:8 }}>{metric.desc}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {metric.nist.map(c => <span key={c} style={{ background:"#d0dff5", color:"#1a3a7a", borderRadius:3, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{c}</span>)}
              </div>
            </div>

            {/* Status buttons */}
            <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:10 }}>IMPLEMENTATION STATUS *</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
              {FISMA_STATUS_OPTS.map(opt => (
                <button key={opt.value} onClick={() => cf("status")(opt.value)} style={{
                  background: cellForm.status === opt.value ? opt.bg      : "#f4f6f9",
                  border:     `2px solid ${cellForm.status === opt.value ? opt.color : "#c5d0de"}`,
                  borderRadius:8, padding:"10px 14px", cursor:"pointer", transition:"all 0.15s", textAlign:"left",
                }}>
                  <div style={{ color: cellForm.status === opt.value ? opt.color : "#3a4a6b", fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700 }}>{opt.label}</div>
                  <div style={{ color: cellForm.status === opt.value ? opt.color : "#8a9ab8", fontFamily:"'DM Mono', monospace", fontSize:9, marginTop:2 }}>{opt.score}% credit</div>
                </button>
              ))}
            </div>

            {/* Notes / evidence */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>FINDINGS / NOTES</label>
              <textarea value={cellForm.notes||""} onChange={e => cf("notes")(e.target.value)} rows={3}
                placeholder="Describe the current state, deficiencies, and supporting observations..."
                style={{ width:"100%", background:"#fff", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.6 }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>EVIDENCE / ARTIFACTS</label>
                <input value={cellForm.evidence||""} onChange={e => cf("evidence")(e.target.value)}
                  placeholder="e.g. Policy v2.1, SIEM dashboard, scan report"
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:6 }}>REVIEWER</label>
                <input value={cellForm.reviewer||""} onChange={e => cf("reviewer")(e.target.value)}
                  placeholder="Reviewer name"
                  style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:8, padding:"10px 14px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
            </div>

            <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
              <Btn variant="secondary" onClick={() => setEditCell(null)}>Cancel</Btn>
              <Btn onClick={saveCell} disabled={!cellForm.status}>Save Score</Btn>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}

// ── Hardware / Software Inventory ─────────────────────────────────────────
// NIST SP 800-53 Rev 5: CM-8, PM-5, SA-22, SR-4

const HW_CATEGORIES = ["Server","Workstation","Laptop","Network Device","Storage","Printer / Peripheral","Mobile Device","Virtual Machine","IoT / Embedded","Other Hardware"];
const SW_CATEGORIES = ["Operating System","Database","Web Server","Application Server","Security Tool","Development Tool","Productivity / Office","Networking / VPN","Backup / Recovery","Middleware","Custom / In-House","Other Software"];
const ASSET_STATUSES  = ["Active","Inactive","Decommissioned","Pending Approval","Under Review"];
const ENVIRONMENTS    = ["Production","Staging","Development","Test","DR / Backup","Lab"];
const CLASSIFICATIONS = ["Unclassified","CUI","Confidential","Secret","Top Secret"];
const LICENSE_TYPES   = ["Perpetual","Subscription","Per-Seat","Site License","Open Source","Freeware","Government / GSA","OEM","Trial"];
const APPROVAL_STATUSES = ["Approved","Pending","Denied","Exception Required"];

const EMPTY_HW = {
  type:"hw", name:"", category:"Server", manufacturer:"", model:"",
  serialNumber:"", assetTag:"", ipAddress:"", macAddress:"",
  os:"", location:"", environment:"Production", classification:"Unclassified",
  owner:"", systemId:"", status:"Active",
  purchaseDate:"", warrantyExpiry:"", eolDate:"", notes:"",
};
const EMPTY_SW = {
  type:"sw", name:"", category:"Operating System", vendor:"", version:"",
  licenseType:"", licenseKey:"", licenseCount:"", licenseExpiry:"",
  installLocation:"", environment:"Production", classification:"Unclassified",
  owner:"", systemId:"", status:"Active", approvalStatus:"Approved",
  installDate:"", eosDate:"", patchLevel:"", notes:"",
};

function isExpired(d)          { return !!d && new Date(d) < new Date(); }
function isExpiringSoon(d, days=90) {
  if (!d) return false;
  const diff = (new Date(d) - new Date()) / 86400000;
  return diff >= 0 && diff <= days;
}

function AssetStatusBadge({ status }) {
  const map = {
    "Active":           ["#d4f5e5","#1a7a4a"],
    "Inactive":         ["#fff3c0","#a07800"],
    "Decommissioned":   ["#ffe0e0","#cc2222"],
    "Pending Approval": ["#ffe8d0","#c45200"],
    "Under Review":     ["#d0dff5","#1a3a7a"],
  };
  const [bg, color] = map[status] || ["#e8eef6","#6b7a99"];
  return (
    <span style={{ background:bg, color, borderRadius:10, padding:"2px 10px",
      fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>
      {status}
    </span>
  );
}

function InventoryView({ systems, defaultSystemId, assets, setAssets }) {
  const [assetType,     setAssetType]     = useState("hw");
  const [viewMode,      setViewMode]      = useState("list");
  const [showForm,      setShowForm]      = useState(false);
  const [editId,        setEditId]        = useState(null);
  const [form,          setForm]          = useState({ ...EMPTY_HW });
  const [filterSys,     setFilterSys]     = useState("all");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [filterCat,     setFilterCat]     = useState("all");
  const [search,        setSearch]        = useState("");
  const [sortField,     setSortField]     = useState("name");
  const [sortDir,       setSortDir]       = useState("asc");
  const [detailAsset,   setDetailAsset]   = useState(null);

  useEffect(() => {
    if (defaultSystemId) setFilterSys(defaultSystemId);
  }, [defaultSystemId]);

  const ff = k => v => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    const base = assetType === "hw" ? EMPTY_HW : EMPTY_SW;
    setForm({ ...base, systemId: filterSys !== "all" ? filterSys : "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = asset => {
    setForm({ ...asset });
    setEditId(asset.id);
    setShowForm(true);
  };

  const saveAsset = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setAssets(p => p.map(a => a.id === editId ? { ...form, id: editId } : a));
    } else {
      setAssets(p => [...p, { ...form, id: uid(), dateAdded: today() }]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const removeAsset = id => {
    setAssets(p => p.filter(a => a.id !== id));
  };

  const sortToggle = field => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────
  const allOfType = assets.filter(a => a.type === assetType);

  const filtered = allOfType
    .filter(a => filterSys    === "all" || a.systemId === filterSys)
    .filter(a => filterStatus === "all" || a.status   === filterStatus)
    .filter(a => filterCat    === "all" || a.category === filterCat)
    .filter(a => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [a.name,a.manufacturer||a.vendor,a.model||a.version,a.assetTag,a.ipAddress,a.serialNumber,a.category]
        .some(f => f?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const av = (a[sortField] || "").toLowerCase();
      const bv = (b[sortField] || "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const stats = {
    total:    allOfType.length,
    active:   allOfType.filter(a => a.status === "Active").length,
    eol:      allOfType.filter(a => isExpired(assetType === "hw" ? a.eolDate : a.eosDate)).length,
    expiring: allOfType.filter(a => isExpiringSoon(assetType === "hw" ? a.warrantyExpiry : a.licenseExpiry)).length,
  };

  const byCat = allOfType.reduce((acc, a) => { acc[a.category] = (acc[a.category]||0)+1; return acc; }, {});

  const categories = assetType === "hw" ? HW_CATEGORIES : SW_CATEGORIES;

  const exportCSV = () => {
    const hw = assetType === "hw";
    const headers = hw
      ? ["Name","Category","Manufacturer","Model","Serial #","Asset Tag","IP Address","MAC","OS","Location","Environment","Classification","Owner","System","Status","Purchase Date","Warranty Expiry","EOL Date","Notes"]
      : ["Name","Category","Vendor","Version","Patch Level","License Type","License Count","License Expiry","Install Location","Environment","Classification","Owner","System","Status","Install Date","EOS Date","Approval","Notes"];
    const rows = filtered.map(a => {
      const sysName = systems.find(s => s.id === a.systemId)?.name || "";
      return hw
        ? [a.name,a.category,a.manufacturer,a.model,a.serialNumber,a.assetTag,a.ipAddress,a.macAddress,a.os,a.location,a.environment,a.classification,a.owner,sysName,a.status,a.purchaseDate,a.warrantyExpiry,a.eolDate,a.notes]
        : [a.name,a.category,a.vendor,a.version,a.patchLevel,a.licenseType,a.licenseCount,a.licenseExpiry,a.installLocation,a.environment,a.classification,a.owner,sysName,a.status,a.installDate,a.eosDate,a.approvalStatus,a.notes];
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = `${hw ? "hardware" : "software"}_inventory_${today()}.csv`;
    a2.click();
    URL.revokeObjectURL(url);
  };

  // ── Sort header component (inline) ────────────────────────────────────
  const SortHdr = ({ field, label }) => (
    <th onClick={() => sortToggle(field)} style={{
      padding:"10px 14px", textAlign:"left", color:"#3a4a6b",
      fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:1,
      cursor:"pointer", userSelect:"none", whiteSpace:"nowrap",
      background:"#f0f4f8", borderBottom:"2px solid #c5d0de",
    }}>
      {label}{" "}
      {sortField === field
        ? <span style={{ color:"#1a3a7a" }}>{sortDir === "asc" ? "↑" : "↓"}</span>
        : <span style={{ color:"#c5d0de" }}>↕</span>}
    </th>
  );

  // ── Field label helper ─────────────────────────────────────────────────
  const FieldLabel = ({ children }) => (
    <label style={{ display:"block", color:"#3a4a6b", fontSize:10,
      fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:5 }}>
      {children}
    </label>
  );

  const DropField = ({ label, k, opts }) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select value={form[k]} onChange={e => ff(k)(e.target.value)} style={{
        width:"100%", background:"#e8eef6", border:"1px solid #c5d0de",
        borderRadius:7, padding:"9px 12px", color:"#0a1628",
        fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none",
      }}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:22, margin:0 }}>
            Hardware &amp; Software Inventory
          </h2>
          <p style={{ color:"#6b7a99", fontSize:13, margin:"4px 0 0", fontFamily:"'DM Mono', monospace" }}>
            NIST SP 800-53 · CM-8 Component Inventory · PM-5 System Inventory · SA-22 Unsupported Components
          </p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn variant="secondary" onClick={exportCSV}>⬇ Export CSV</Btn>
          <Btn onClick={openAdd}>＋ Add {assetType === "hw" ? "Hardware" : "Software"}</Btn>
        </div>
      </div>

      {/* Type toggle + view mode */}
      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#e8eef6", borderRadius:10, padding:3, gap:2 }}>
          {[{ id:"hw", icon:"🖥", label:"Hardware" }, { id:"sw", icon:"💿", label:"Software" }].map(t => (
            <button key={t.id} onClick={() => { setAssetType(t.id); setFilterCat("all"); setSearch(""); }} style={{
              background: assetType === t.id ? "#1a3a7a" : "transparent",
              color:      assetType === t.id ? "#fff"    : "#3a4a6b",
              border:"none", borderRadius:8, padding:"8px 20px",
              fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700,
              cursor:"pointer", display:"flex", alignItems:"center", gap:7,
              transition:"all 0.15s",
            }}>
              {t.icon} {t.label}
              <span style={{ fontSize:10, opacity:0.75 }}>({assets.filter(a=>a.type===t.id).length})</span>
            </button>
          ))}
        </div>
        <div style={{ flex:1 }} />
        {[{ id:"list", icon:"☰", label:"List" }, { id:"summary", icon:"⊞", label:"Summary" }].map(m => (
          <button key={m.id} onClick={() => setViewMode(m.id)} style={{
            background: viewMode === m.id ? "#1a3a7a" : "#e8eef6",
            color:      viewMode === m.id ? "#fff"    : "#6b7a99",
            border:"none", borderRadius:7, padding:"7px 16px",
            fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700, cursor:"pointer",
          }}>{m.icon} {m.label}</button>
        ))}
      </div>

      {/* Stat tiles */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        {[
          { label:"Total",         value:stats.total,    color:"#1a3a7a", bg:"#d0dff5" },
          { label:"Active",        value:stats.active,   color:"#1a7a4a", bg:"#d4f5e5" },
          { label:"EOL / EOS",     value:stats.eol,      color:stats.eol > 0     ? "#cc2222" : "#6b7a99", bg:stats.eol > 0     ? "#ffe0e0" : "#e8eef6" },
          { label:"Expiring Soon", value:stats.expiring, color:stats.expiring > 0 ? "#c45200" : "#6b7a99", bg:stats.expiring > 0 ? "#ffe8d0" : "#e8eef6" },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.color}33`, borderRadius:10, padding:"10px 20px", textAlign:"center", minWidth:90 }}>
            <div style={{ color:s.color, fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:900 }}>{s.value}</div>
            <div style={{ color:s.color, fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginTop:1 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:10, padding:"14px 16px", marginBottom:16, display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:10, alignItems:"end" }}>
        <div>
          <label style={{ display:"block", color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:4 }}>SEARCH</label>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={assetType === "hw" ? "Name, manufacturer, model, IP, serial, tag…" : "Name, vendor, version, install location…"}
            style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"8px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none", boxSizing:"border-box" }} />
        </div>
        {[
          { label:"SYSTEM",   value:filterSys,    set:setFilterSys,    opts:[{v:"all",l:"All Systems"},    ...systems.map(s=>({v:s.id,l:s.name}))] },
          { label:"CATEGORY", value:filterCat,    set:setFilterCat,    opts:[{v:"all",l:"All Categories"}, ...categories.map(c=>({v:c,l:c}))] },
          { label:"STATUS",   value:filterStatus, set:setFilterStatus, opts:[{v:"all",l:"All Statuses"},   ...ASSET_STATUSES.map(s=>({v:s,l:s}))] },
        ].map(f => (
          <div key={f.label}>
            <label style={{ display:"block", color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:4 }}>{f.label}</label>
            <select value={f.value} onChange={e => f.set(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"8px 10px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:11, outline:"none" }}>
              {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !showForm && (
        <div style={{ textAlign:"center", padding:60, color:"#8a9ab8", border:"2px dashed #c5d0de", borderRadius:14 }}>
          <div style={{ fontSize:52, marginBottom:14 }}>{assetType === "hw" ? "🖥" : "💿"}</div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:15, fontWeight:900, color:"#3a4a6b", marginBottom:6 }}>
            No {assetType === "hw" ? "hardware" : "software"} assets yet
          </div>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, marginBottom:20, color:"#aab8cc" }}>
            Add assets manually to track your component inventory per CM-8
          </div>
          <Btn onClick={openAdd}>＋ Add First {assetType === "hw" ? "Hardware" : "Software"} Asset</Btn>
        </div>
      )}

      {/* ═══════════ LIST VIEW ═══════════════════════════════════════════ */}
      {viewMode === "list" && filtered.length > 0 && (
        <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
              <thead>
                <tr>
                  <SortHdr field="name"     label="NAME" />
                  <SortHdr field="category" label="CATEGORY" />
                  {assetType === "hw" ? (
                    <>
                      <SortHdr field="manufacturer" label="MANUFACTURER" />
                      <SortHdr field="model"        label="MODEL" />
                      <SortHdr field="ipAddress"    label="IP ADDRESS" />
                      <SortHdr field="assetTag"     label="ASSET TAG" />
                      <SortHdr field="eolDate"      label="EOL DATE" />
                    </>
                  ) : (
                    <>
                      <SortHdr field="vendor"        label="VENDOR" />
                      <SortHdr field="version"       label="VERSION" />
                      <SortHdr field="licenseExpiry" label="LIC. EXPIRY" />
                      <SortHdr field="approvalStatus" label="APPROVAL" />
                      <SortHdr field="eosDate"       label="EOS DATE" />
                    </>
                  )}
                  <SortHdr field="environment" label="ENV" />
                  <SortHdr field="status"      label="STATUS" />
                  <th style={{ padding:"10px 14px", background:"#f0f4f8", borderBottom:"2px solid #c5d0de", width:120 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset, idx) => {
                  const sys     = systems.find(s => s.id === asset.systemId);
                  const eolDate = assetType === "hw" ? asset.eolDate : asset.eosDate;
                  const warnDate= assetType === "hw" ? asset.warrantyExpiry : asset.licenseExpiry;
                  const isEOL   = isExpired(eolDate);
                  const isWarn  = isExpiringSoon(warnDate);
                  const rowBg   = isEOL ? "#fff8f8" : isWarn ? "#fffcf0" : idx % 2 === 0 ? "#fff" : "#fafbfd";
                  return (
                    <tr key={asset.id} style={{ background:rowBg, borderBottom:"1px solid #f0f4f8" }}>
                      <td style={{ padding:"11px 14px", maxWidth:220 }}>
                        <div style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{asset.name}</div>
                        {sys && <div style={{ color:"#8a9ab8", fontSize:9, fontFamily:"'DM Mono', monospace", marginTop:2 }}>{sys.name}</div>}
                        {isEOL  && <span style={{ background:"#ffe0e0", color:"#cc2222", borderRadius:3, padding:"1px 5px", fontSize:8, fontFamily:"'DM Mono', monospace", fontWeight:700, marginTop:3, display:"inline-block" }}>⚠ EOL/EOS</span>}
                        {!isEOL && isWarn && <span style={{ background:"#ffe8d0", color:"#c45200", borderRadius:3, padding:"1px 5px", fontSize:8, fontFamily:"'DM Mono', monospace", fontWeight:700, marginTop:3, display:"inline-block" }}>⏰ EXPIRING</span>}
                      </td>
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ background:"#e8eef6", color:"#3a4a6b", borderRadius:4, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace" }}>{asset.category}</span>
                      </td>
                      {assetType === "hw" ? (
                        <>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{asset.manufacturer || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{asset.model        || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight: asset.ipAddress ? 600 : 400 }}>{asset.ipAddress   || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{asset.assetTag    || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px" }}>
                            {asset.eolDate
                              ? <span style={{ color: isExpired(asset.eolDate)?"#cc2222":"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight: isExpired(asset.eolDate)?700:400 }}>{asset.eolDate}</span>
                              : <span style={{color:"#c5d0de"}}>—</span>}
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{asset.vendor  || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px", color:"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace" }}>{asset.version || <span style={{color:"#c5d0de"}}>—</span>}</td>
                          <td style={{ padding:"11px 14px" }}>
                            {asset.licenseExpiry
                              ? <span style={{ color: isExpired(asset.licenseExpiry)?"#cc2222":isExpiringSoon(asset.licenseExpiry)?"#c45200":"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight: (isExpired(asset.licenseExpiry)||isExpiringSoon(asset.licenseExpiry))?700:400 }}>
                                  {asset.licenseExpiry}
                                </span>
                              : <span style={{color:"#c5d0de"}}>—</span>}
                          </td>
                          <td style={{ padding:"11px 14px" }}>
                            {asset.approvalStatus && (() => {
                              const c = { "Approved":["#d4f5e5","#1a7a4a"], "Pending":["#fff3c0","#a07800"], "Denied":["#ffe0e0","#cc2222"], "Exception Required":["#ffe8d0","#c45200"] }[asset.approvalStatus] || ["#e8eef6","#6b7a99"];
                              return <span style={{ background:c[0], color:c[1], borderRadius:4, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{asset.approvalStatus}</span>;
                            })()}
                          </td>
                          <td style={{ padding:"11px 14px" }}>
                            {asset.eosDate
                              ? <span style={{ color: isExpired(asset.eosDate)?"#cc2222":"#3a4a6b", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight: isExpired(asset.eosDate)?700:400 }}>{asset.eosDate}</span>
                              : <span style={{color:"#c5d0de"}}>—</span>}
                          </td>
                        </>
                      )}
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ background:"#e8eef6", color:"#3a4a6b", borderRadius:4, padding:"2px 8px", fontSize:10, fontFamily:"'DM Mono', monospace" }}>{asset.environment}</span>
                      </td>
                      <td style={{ padding:"11px 14px" }}><AssetStatusBadge status={asset.status} /></td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <Btn small variant="secondary" onClick={() => setDetailAsset(asset)}>Detail</Btn>
                          <Btn small variant="secondary" onClick={() => openEdit(asset)}>✎</Btn>
                          <Btn small variant="danger"    onClick={() => removeAsset(asset.id)}>✕</Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"9px 16px", borderTop:"1px solid #e8eef6", color:"#8a9ab8", fontSize:10, fontFamily:"'DM Mono', monospace" }}>
            Showing {filtered.length} of {allOfType.length} {assetType === "hw" ? "hardware" : "software"} assets
          </div>
        </div>
      )}

      {/* ═══════════ SUMMARY VIEW ════════════════════════════════════════ */}
      {viewMode === "summary" && allOfType.length > 0 && (
        <div style={{ display:"grid", gap:16 }}>

          {/* By category */}
          <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:24 }}>
            <h3 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:15, margin:"0 0 16px" }}>
              {assetType === "hw" ? "🖥" : "💿"} By Category
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px,1fr))", gap:10 }}>
              {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat, cnt]) => (
                <div key={cat} style={{ background:"#f0f4f8", borderRadius:8, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace" }}>{cat}</span>
                  <span style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:900 }}>{cnt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By system */}
          {systems.length > 0 && (
            <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:24 }}>
              <h3 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:15, margin:"0 0 16px" }}>By System</h3>
              <div style={{ display:"grid", gap:8 }}>
                {[...systems, { id:"", name:"(Unassigned)" }].map(sys => {
                  const cnt = allOfType.filter(a => (a.systemId||"") === sys.id).length;
                  if (!cnt) return null;
                  const pct = Math.round(cnt / allOfType.length * 100);
                  return (
                    <div key={sys.id||"unassigned"} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", minWidth:180 }}>{sys.name}</div>
                      <div style={{ flex:1, background:"#e8eef6", borderRadius:4, height:10, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:"#1a3a7a", borderRadius:4, transition:"width 0.3s" }} />
                      </div>
                      <span style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:900, minWidth:28, textAlign:"right" }}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EOL / Expiry alerts */}
          {(stats.eol > 0 || stats.expiring > 0) && (
            <div style={{ background:"#fff", border:"2px solid #f0a030", borderRadius:12, padding:24 }}>
              <h3 style={{ color:"#8a5000", fontFamily:"'Syne', sans-serif", fontSize:15, margin:"0 0 14px" }}>
                ⚠ Attention Required ({stats.eol + stats.expiring} items)
              </h3>
              <div style={{ display:"grid", gap:8 }}>
                {allOfType
                  .filter(a => {
                    const eolD  = assetType === "hw" ? a.eolDate        : a.eosDate;
                    const warnD = assetType === "hw" ? a.warrantyExpiry : a.licenseExpiry;
                    return isExpired(eolD) || isExpiringSoon(warnD);
                  })
                  .map(asset => {
                    const eolD  = assetType === "hw" ? asset.eolDate        : asset.eosDate;
                    const warnD = assetType === "hw" ? asset.warrantyExpiry : asset.licenseExpiry;
                    const expired = isExpired(eolD);
                    return (
                      <div key={asset.id} style={{ background: expired?"#fff0f0":"#fffaf0", border:`1px solid ${expired?"#ffcccc":"#f0d080"}`, borderRadius:8, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                        <div>
                          <div style={{ color:"#0a1628", fontSize:12, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{asset.name}</div>
                          <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:2 }}>
                            {expired
                              ? `⚠ EOL/EOS: ${eolD} — immediate action required`
                              : `⏰ ${assetType === "hw" ? "Warranty" : "License"} expiring: ${warnD}`}
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                          <AssetStatusBadge status={asset.status} />
                          <Btn small variant="secondary" onClick={() => openEdit(asset)}>✎ Update</Btn>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Environment breakdown */}
          <div style={{ background:"#fff", border:"1px solid #c5d0de", borderRadius:12, padding:24 }}>
            <h3 style={{ color:"#0a1628", fontFamily:"'Syne', sans-serif", fontSize:15, margin:"0 0 16px" }}>By Environment</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px,1fr))", gap:10 }}>
              {ENVIRONMENTS.map(env => {
                const cnt = allOfType.filter(a => a.environment === env).length;
                if (!cnt) return null;
                return (
                  <div key={env} style={{ background:"#f0f4f8", borderRadius:8, padding:"10px 14px", textAlign:"center" }}>
                    <div style={{ color:"#1a3a7a", fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:900 }}>{cnt}</div>
                    <div style={{ color:"#6b7a99", fontSize:10, fontFamily:"'DM Mono', monospace", marginTop:2 }}>{env}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ ADD / EDIT MODAL ════════════════════════════════════ */}
      {showForm && (
        <Modal
          title={`${editId ? "Edit" : "Add"} ${assetType === "hw" ? "Hardware" : "Software"} Asset`}
          onClose={() => { setShowForm(false); setEditId(null); }}
          width={800}
        >
          {assetType === "hw" ? (
            <div style={{ display:"grid", gap:12 }}>
              <Input label="ASSET NAME *" value={form.name} onChange={ff("name")} placeholder="e.g. Web Server 01" required />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <DropField label="CATEGORY"      k="category"       opts={HW_CATEGORIES} />
                <Input label="MANUFACTURER"      value={form.manufacturer} onChange={ff("manufacturer")} placeholder="e.g. Dell, HP, Cisco" />
                <Input label="MODEL"             value={form.model}        onChange={ff("model")}        placeholder="e.g. PowerEdge R750" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Input label="SERIAL NUMBER"     value={form.serialNumber} onChange={ff("serialNumber")} placeholder="Hardware serial" />
                <Input label="ASSET TAG"         value={form.assetTag}     onChange={ff("assetTag")}     placeholder="Org asset tag" />
                <Input label="IP ADDRESS"        value={form.ipAddress}    onChange={ff("ipAddress")}    placeholder="e.g. 10.0.1.10" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Input label="MAC ADDRESS"       value={form.macAddress}   onChange={ff("macAddress")}   placeholder="AA:BB:CC:DD:EE:FF" />
                <Input label="OPERATING SYSTEM"  value={form.os}           onChange={ff("os")}           placeholder="e.g. Windows Server 2022" />
                <Input label="PHYSICAL LOCATION" value={form.location}     onChange={ff("location")}     placeholder="e.g. Rack 3, DC-A" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                <DropField label="ENVIRONMENT"    k="environment"    opts={ENVIRONMENTS} />
                <DropField label="CLASSIFICATION" k="classification" opts={CLASSIFICATIONS} />
                <DropField label="STATUS"         k="status"         opts={ASSET_STATUSES} />
                <div>
                  <FieldLabel>SYSTEM</FieldLabel>
                  <select value={form.systemId} onChange={e => ff("systemId")(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                    <option value="">— Unassigned —</option>
                    {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                <Input label="OWNER / POC"       value={form.owner}         onChange={ff("owner")}         placeholder="Responsible party" />
                <Input label="PURCHASE DATE"     value={form.purchaseDate}  onChange={ff("purchaseDate")}  type="date" />
                <Input label="WARRANTY EXPIRY"   value={form.warrantyExpiry} onChange={ff("warrantyExpiry")} type="date" />
                <Input label="EOL DATE"          value={form.eolDate}       onChange={ff("eolDate")}       type="date" />
              </div>
              <Textarea label="NOTES" value={form.notes} onChange={ff("notes")} rows={2} placeholder="Dependencies, interconnections, special handling..." />
            </div>
          ) : (
            <div style={{ display:"grid", gap:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12 }}>
                <Input label="SOFTWARE NAME *" value={form.name} onChange={ff("name")} placeholder="e.g. Microsoft SQL Server 2022" required />
                <DropField label="CATEGORY" k="category" opts={SW_CATEGORIES} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Input label="VENDOR"        value={form.vendor}      onChange={ff("vendor")}      placeholder="e.g. Microsoft, Oracle" />
                <Input label="VERSION"       value={form.version}     onChange={ff("version")}     placeholder="e.g. 2022, 19c" />
                <Input label="PATCH LEVEL"   value={form.patchLevel}  onChange={ff("patchLevel")}  placeholder="e.g. KB5028185" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <DropField label="LICENSE TYPE" k="licenseType" opts={["", ...LICENSE_TYPES]} />
                <Input label="LICENSE COUNT"    value={form.licenseCount}  onChange={ff("licenseCount")}  placeholder="e.g. 50" />
                <Input label="LICENSE EXPIRY"   value={form.licenseExpiry} onChange={ff("licenseExpiry")} type="date" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                <DropField label="ENVIRONMENT"    k="environment"    opts={ENVIRONMENTS} />
                <DropField label="CLASSIFICATION" k="classification" opts={CLASSIFICATIONS} />
                <DropField label="STATUS"         k="status"         opts={ASSET_STATUSES} />
                <DropField label="APPROVAL"       k="approvalStatus" opts={APPROVAL_STATUSES} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
                <div>
                  <FieldLabel>SYSTEM</FieldLabel>
                  <select value={form.systemId} onChange={e => ff("systemId")(e.target.value)} style={{ width:"100%", background:"#e8eef6", border:"1px solid #c5d0de", borderRadius:7, padding:"9px 12px", color:"#0a1628", fontFamily:"'DM Mono', monospace", fontSize:12, outline:"none" }}>
                    <option value="">— Unassigned —</option>
                    {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <Input label="INSTALL LOCATION" value={form.installLocation} onChange={ff("installLocation")} placeholder="e.g. 10.0.1.10, all workstations" />
                <Input label="OWNER / POC"      value={form.owner}           onChange={ff("owner")}           placeholder="Responsible party" />
                <Input label="LICENSE KEY"      value={form.licenseKey}      onChange={ff("licenseKey")}      placeholder="XXXXX-XXXXX-XXXXX" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Input label="INSTALL DATE"       value={form.installDate}   onChange={ff("installDate")}   type="date" />
                <Input label="END OF SUPPORT DATE" value={form.eosDate}      onChange={ff("eosDate")}       type="date" />
              </div>
              <Textarea label="NOTES" value={form.notes} onChange={ff("notes")} rows={2} placeholder="Dependencies, deployment notes, exception rationale..." />
            </div>
          )}

          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:16 }}>
            <Btn variant="secondary" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Btn>
            <Btn onClick={saveAsset} disabled={!form.name.trim()}>
              {editId ? "Save Changes" : `Add ${assetType === "hw" ? "Hardware" : "Software"}`}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ═══════════ DETAIL MODAL ════════════════════════════════════════ */}
      {detailAsset && (
        <Modal title={detailAsset.name} onClose={() => setDetailAsset(null)} width={700}>
          <div style={{ display:"grid", gap:14 }}>
            {/* Badge row */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Badge color="#e8eef6" textColor="#3a4a6b">{detailAsset.type === "hw" ? "🖥 Hardware" : "💿 Software"}</Badge>
              <Badge color="#e8eef6" textColor="#3a4a6b">{detailAsset.category}</Badge>
              <AssetStatusBadge status={detailAsset.status} />
              {detailAsset.classification && <Badge color="#d0dff5" textColor="#1a3a7a">{detailAsset.classification}</Badge>}
              {detailAsset.environment    && <Badge color="#e8eef6" textColor="#6b7a99">{detailAsset.environment}</Badge>}
            </div>

            {/* Field grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {(detailAsset.type === "hw" ? [
                ["Manufacturer",  detailAsset.manufacturer],
                ["Model",         detailAsset.model],
                ["Serial Number", detailAsset.serialNumber],
                ["Asset Tag",     detailAsset.assetTag],
                ["IP Address",    detailAsset.ipAddress],
                ["MAC Address",   detailAsset.macAddress],
                ["OS",            detailAsset.os],
                ["Location",      detailAsset.location],
                ["Owner",         detailAsset.owner],
                ["Purchase Date", detailAsset.purchaseDate],
                ["Warranty Exp.", detailAsset.warrantyExpiry],
                ["EOL Date",      detailAsset.eolDate],
              ] : [
                ["Vendor",         detailAsset.vendor],
                ["Version",        detailAsset.version],
                ["Patch Level",    detailAsset.patchLevel],
                ["License Type",   detailAsset.licenseType],
                ["License Count",  detailAsset.licenseCount],
                ["License Expiry", detailAsset.licenseExpiry],
                ["EOS Date",       detailAsset.eosDate],
                ["Install Loc.",   detailAsset.installLocation],
                ["Approval",       detailAsset.approvalStatus],
                ["Owner",          detailAsset.owner],
                ["Install Date",   detailAsset.installDate],
                ["License Key",    detailAsset.licenseKey],
              ]).filter(([, v]) => v).map(([l, v]) => (
                <div key={l} style={{ background:"#f0f4f8", borderRadius:7, padding:"8px 12px" }}>
                  <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:2 }}>{l.toUpperCase()}</div>
                  <div style={{ color:"#0a1628", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700, wordBreak:"break-all" }}>{v}</div>
                </div>
              ))}
              {systems.find(s => s.id === detailAsset.systemId) && (
                <div style={{ background:"#d0dff5", borderRadius:7, padding:"8px 12px" }}>
                  <div style={{ color:"#1a3a7a", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:2 }}>SYSTEM</div>
                  <div style={{ color:"#1a3a7a", fontSize:11, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>{systems.find(s => s.id === detailAsset.systemId).name}</div>
                </div>
              )}
            </div>

            {detailAsset.notes && (
              <div style={{ background:"#f7faff", border:"1px solid #dce8f5", borderRadius:8, padding:"10px 14px" }}>
                <div style={{ color:"#6b7a99", fontSize:9, fontFamily:"'DM Mono', monospace", letterSpacing:1, marginBottom:5 }}>NOTES</div>
                <div style={{ color:"#3a4a6b", fontSize:12, fontFamily:"'DM Mono', monospace", lineHeight:1.6 }}>{detailAsset.notes}</div>
              </div>
            )}

            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="secondary" onClick={() => { openEdit(detailAsset); setDetailAsset(null); }}>✎ Edit</Btn>
              <Btn variant="secondary" onClick={() => setDetailAsset(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [systems, setSystems] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [poams, setPoams] = useState([]);
  const [controlStatuses, setControlStatuses] = useState({});
  const [activeSystemId, setActiveSystemId] = useState("");
  const [assets, setAssets] = useState([]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "systems", label: "Systems", icon: "◈" },
    { id: "vulnerabilities", label: "Vulnerabilities", icon: "⚡" },
    { id: "controls", label: "Controls", icon: "⊞" },
    { id: "poams", label: "POAMs", icon: "📋" },
    { id: "rar", label: "Risk Assessment", icon: "⚠" },
    { id: "fisma", label: "FISMA Review", icon: "🏛" },
    { id: "inventory", label: "Inventory", icon: "🗄" },
    { id: "sar", label: "SAR", icon: "📄" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f0f4f8; }
        ::-webkit-scrollbar-thumb { background: #c5d0de; border-radius: 3px; }
        select option { background: #ffffff; color: #0a1628; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.3); }
      `}</style>

      {/* Sidebar */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: "#0a1628", borderRight: "1px solid #e8eef6", zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, background: "#1a3a7a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>⬡</div>
            <div>
              <div style={{ color: "#ffffff", fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 900, letterSpacing: 1 }}>RMF TRACKER</div>
              <div style={{ color: "#7caadf", fontSize: 9, letterSpacing: 2 }}>NIST 800-53 REV 5</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "0 12px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: "100%", textAlign: "left", background: tab === t.id ? "rgba(255,255,255,0.12)" : "none",
              border: "none", borderRadius: 8, padding: "10px 14px",
              color: tab === t.id ? "#ffffff" : "#8aafd4",
              fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer",
              marginBottom: 4, display: "flex", alignItems: "center", gap: 10,
              borderLeft: tab === t.id ? "3px solid #7caadf" : "3px solid transparent",
              transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
              {t.id === "controls" && (() => {
                const nonCompliant = Object.values(controlStatuses).filter(s => s.status === "Non-Compliant" || s.status === "Not Implemented").length;
                return nonCompliant > 0 ? (
                  <span style={{ marginLeft: "auto", background: "#c45200", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{nonCompliant}</span>
                ) : null;
              })()}
              {t.id === "poams" && poams.length > 0 && (
                <span style={{ marginLeft: "auto", background: "#8a6200", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{poams.length}</span>
              )}
              {t.id === "vulnerabilities" && vulnerabilities.filter(v => v.status === "Open").length > 0 && (
                <span style={{ marginLeft: "auto", background: "#cc2222", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{vulnerabilities.filter(v => v.status === "Open").length}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {activeSystemId && (() => {
            const activeSys = systems.find(s => s.id === activeSystemId);
            return activeSys ? (
              <div style={{ marginBottom: 12, background: "rgba(124,170,223,0.15)", borderRadius: 7, padding: "8px 10px", border: "1px solid rgba(124,170,223,0.3)" }}>
                <div style={{ color: "#7caadf", fontSize: 9, letterSpacing: 1, marginBottom: 3 }}>ACTIVE SYSTEM</div>
                <div style={{ color: "#ffffff", fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSys.name}</div>
                <button onClick={() => setActiveSystemId("")} style={{ background: "none", border: "none", color: "#8aafd4", fontSize: 9, cursor: "pointer", padding: 0, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>✕ clear</button>
              </div>
            ) : null;
          })()}
          <div style={{ color: "#7caadf", fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>SUMMARY</div>
          {[
            { label: "Systems", value: systems.length },
            { label: "Vulns", value: vulnerabilities.length },
            { label: "POAMs", value: poams.length },
            { label: "Controls", value: ALL_CONTROLS.length },
            { label: "Assets", value: assets.length },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#8aafd4", fontSize: 11 }}>{s.label}</span>
              <span style={{ color: "#ffffff", fontSize: 11, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: 32, minHeight: "100vh" }}>
        {tab === "dashboard" && <Dashboard systems={systems} vulnerabilities={vulnerabilities} poams={poams} />}
        {tab === "systems" && <SystemsView systems={systems} setSystems={setSystems} vulnerabilities={vulnerabilities} controlStatuses={controlStatuses} setControlStatuses={setControlStatuses} activeSystemId={activeSystemId} setActiveSystemId={setActiveSystemId} />}
        {tab === "vulnerabilities" && <VulnerabilitiesView vulnerabilities={vulnerabilities} setVulnerabilities={setVulnerabilities} systems={systems} setPoams={setPoams} defaultSystemId={activeSystemId} />}
        {tab === "controls" && <ControlsView systems={systems} vulnerabilities={vulnerabilities} setVulnerabilities={setVulnerabilities} controlStatuses={controlStatuses} setControlStatuses={setControlStatuses} poams={poams} setPoams={setPoams} defaultSystemId={activeSystemId} />}
        {tab === "poams" && <PoamsView poams={poams} setPoams={setPoams} systems={systems} />}
        {tab === "rar" && <RarView systems={systems} vulnerabilities={vulnerabilities} poams={poams} controlStatuses={controlStatuses} defaultSystemId={activeSystemId} />}
        {tab === "fisma" && <FismaView systems={systems} vulnerabilities={vulnerabilities} poams={poams} controlStatuses={controlStatuses} defaultSystemId={activeSystemId} />}
        {tab === "inventory" && <InventoryView systems={systems} defaultSystemId={activeSystemId} assets={assets} setAssets={setAssets} />}
        {tab === "sar" && <SarView systems={systems} vulnerabilities={vulnerabilities} poams={poams} defaultSystemId={activeSystemId} />}
      </div>
    </div>
  );
}
