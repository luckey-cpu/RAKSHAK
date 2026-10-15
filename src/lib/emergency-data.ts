import { EmergencyServiceItem } from './types';

export const verifiedEmergencyServices: EmergencyServiceItem[] = [
  {
    id: 'srv-112',
    category: 'Police',
    name: 'National Emergency Number (All-in-One)',
    number: '112',
    altNumber: '100',
    availability: '24/7 National Emergency Service',
    area: 'Pan-India (All States & UTs)',
    source: 'Ministry of Home Affairs (MHA), Govt. of India',
    verified: true,
    priorityCall112: true,
    description: 'Unified emergency response support system (ERSS) for Police, Medical, Fire, and Disaster rescue.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'srv-108',
    category: 'Ambulance & Medical',
    name: 'National Ambulance Emergency Service',
    number: '108',
    altNumber: '102',
    availability: '24/7 Emergency Dispatch',
    area: 'Pan-India',
    source: 'National Health Mission (NHM), MoHFW',
    verified: true,
    priorityCall112: true,
    description: 'Free emergency ambulance service for critical trauma, cardiac events, maternal emergencies, and road accidents.',
    iconName: 'Ambulance'
  },
  {
    id: 'srv-101',
    category: 'Fire & Rescue',
    name: 'Fire Brigade & Rescue Helpline',
    number: '101',
    altNumber: '112',
    availability: '24/7 Emergency Response',
    area: 'Pan-India',
    source: 'Directorate General Fire Services, MHA',
    verified: true,
    priorityCall112: true,
    description: 'Immediate fire fighting, building collapse rescue, hazardous gas leakage, and trapped person recovery.',
    iconName: 'Flame'
  },
  {
    id: 'srv-1095',
    category: 'Traffic Police',
    name: 'Traffic Police Road Safety & Hazard Helpline',
    number: '1095',
    altNumber: '1033',
    availability: '24/7 Live Monitoring',
    area: 'Major Metros & State Capitals',
    source: 'State Traffic Police Departments & MoRTH',
    verified: true,
    priorityCall112: false,
    description: 'Report road blockades, traffic signal breakdowns, severe congestion, and immediate road obstacles.',
    iconName: 'TrafficCone'
  },
  {
    id: 'srv-1091',
    category: 'Women Safety',
    name: 'National Women Helpline & Support',
    number: '1091',
    altNumber: '181',
    availability: '24/7 Dedicated Support',
    area: 'Pan-India',
    source: 'Ministry of Women and Child Development (MoWCD)',
    verified: true,
    priorityCall112: true,
    description: 'Instant response for women in distress, harassment reporting, domestic crisis, and legal/medical referral.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'srv-1098',
    category: 'Child Protection',
    name: 'CHILDLINE India (Child Protection & Rescue)',
    number: '1098',
    altNumber: '112',
    availability: '24/7 Free Helpline',
    area: 'Pan-India',
    source: 'Ministry of Women & Child Development',
    verified: true,
    priorityCall112: false,
    description: 'Emergency assistance for abandoned children, child labour, abuse, runaway children, and missing reports.',
    iconName: 'Baby'
  },
  {
    id: 'srv-1078',
    category: 'Disaster Management',
    name: 'NDRF & National Disaster Management Helpline',
    number: '1078',
    altNumber: '1070',
    availability: '24/7 Disaster Operations Center',
    area: 'Pan-India',
    source: 'National Disaster Management Authority (NDMA)',
    verified: true,
    priorityCall112: false,
    description: 'Flood relief, cyclone warnings, earthquake rescue operations, and structural disaster assistance.',
    iconName: 'AlertTriangle'
  },
  {
    id: 'srv-1033',
    category: 'Roadside Assistance',
    name: 'National Highway Emergency & Breakdown (NHAI)',
    number: '1033',
    altNumber: '1800-112-222',
    availability: '24/7 Highway Patrol',
    area: 'All National Highways & Expressways',
    source: 'National Highways Authority of India (NHAI)',
    verified: true,
    priorityCall112: false,
    description: 'Towing assistance, emergency ambulance, patrol support, and removal of vehicle breakdowns on highways.',
    iconName: 'Car'
  },
  {
    id: 'srv-1912',
    category: 'Electricity Faults',
    name: 'Pan-India Electricity Consumer & Hazard Helpline',
    number: '1912',
    altNumber: 'Local DISCOM',
    availability: '24/7 Dispatch',
    area: 'All States (DISCOM Network)',
    source: 'Ministry of Power & State Electricity Boards',
    verified: true,
    priorityCall112: false,
    description: 'Report live hanging wires, transformer sparks, power grid outages, and electrical shocks.',
    iconName: 'Zap'
  },
  {
    id: 'srv-1916',
    category: 'Water & Sanitation',
    name: 'Civic Water Supply & Sewerage Emergency',
    number: '1916',
    altNumber: '1969',
    availability: '06:00 AM - 10:00 PM',
    area: 'Municipal Jal Boards (Delhi, Mumbai, Jaipur, Bangalore)',
    source: 'State Jal Boards & Urban Local Bodies',
    verified: true,
    priorityCall112: false,
    description: 'Report major water pipe bursts, dirty water contamination, overflowing sewage lines, and dry tankers.',
    iconName: 'Droplet'
  },
  {
    id: 'srv-181-raj',
    category: 'Municipal & Civic',
    name: 'Rajasthan Sampark / Citizen Helpline',
    number: '181',
    altNumber: '0141-2227181',
    availability: '24/7 Citizen Portal',
    area: 'Rajasthan (Jaipur, Jodhpur, Udaipur, etc.)',
    source: 'Government of Rajasthan Department of Public Grievances',
    verified: true,
    priorityCall112: false,
    description: 'Centralized public grievance cell for municipal roads, sanitation, streetlight, and water issues.',
    iconName: 'Building2'
  },
  {
    id: 'srv-1962',
    category: 'Animal Rescue',
    name: 'Veterinary Emergency & Animal Rescue Helpline',
    number: '1962',
    altNumber: '011-23355242',
    availability: '08:00 AM - 08:00 PM',
    area: 'Pan-India (Animal Husbandry & NGOs)',
    source: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    verified: true,
    priorityCall112: false,
    description: 'Emergency medical care for injured stray animals, street cattle accidents, and wildlife rescue.',
    iconName: 'PawPrint'
  },
  {
    id: 'srv-14416',
    category: 'Mental Health',
    name: 'Tele-MANAS National Mental Health Crisis Helpline',
    number: '14416',
    altNumber: '1800-891-4416',
    availability: '24/7 Toll-Free & Confidential',
    area: 'Pan-India (Multi-lingual in 20+ Languages)',
    source: 'Ministry of Health and Family Welfare (MoHFW) / NIMHANS',
    verified: true,
    priorityCall112: false,
    description: 'Immediate counseling and crisis support for emotional distress, anxiety, depression, and suicide prevention.',
    iconName: 'HeartPulse'
  },
  {
    id: 'srv-1930',
    category: 'Public Essential',
    name: 'National Cyber Crime Financial Fraud Helpline',
    number: '1930',
    altNumber: '155260',
    availability: '24/7 Golden Hour Action',
    area: 'Pan-India',
    source: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    verified: true,
    priorityCall112: false,
    description: 'Instant blocking of fraudulent bank transactions and reporting online cyber financial crimes.',
    iconName: 'Lock'
  }
];

export interface VerifiedHospital {
  id: string;
  name: string;
  type: 'Government Apex Hospital' | 'District Hospital' | 'Emergency & Trauma Centre';
  city: string;
  state: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  has24x7Emergency: boolean;
  bloodBankAvailable: boolean;
  lat: number;
  lng: number;
}

export const verifiedHospitals: VerifiedHospital[] = [
  {
    id: 'hosp-del-aiims',
    name: 'AIIMS (All India Institute of Medical Sciences)',
    type: 'Government Apex Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '011-26588500',
    emergencyPhone: '011-26593666',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 28.5672,
    lng: 77.2100
  },
  {
    id: 'hosp-del-safdarjung',
    name: 'Safdarjung Hospital & Trauma Centre',
    type: 'Emergency & Trauma Centre',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
    phone: '011-26165060',
    emergencyPhone: '011-26707444',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 28.5704,
    lng: 77.2078
  },
  {
    id: 'hosp-jpr-sms',
    name: 'Sawai Man Singh (SMS) Hospital & Trauma Centre',
    type: 'Government Apex Hospital',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Jawahar Lal Nehru Marg, Ashok Nagar, Jaipur, Rajasthan 302001',
    phone: '0141-2560291',
    emergencyPhone: '0141-2518200',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 26.8997,
    lng: 75.8159
  },
  {
    id: 'hosp-jpr-jaipuria',
    name: 'Rukmani Devi Jaipuria Hospital',
    type: 'District Hospital',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Milap Nagar, JLN Marg, Malviya Nagar, Jaipur, Rajasthan 302018',
    phone: '0141-2551500',
    emergencyPhone: '0141-2551501',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 26.8522,
    lng: 75.8075
  },
  {
    id: 'hosp-mum-kem',
    name: 'King Edward Memorial (KEM) Hospital',
    type: 'Government Apex Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    phone: '022-24107000',
    emergencyPhone: '022-24136051',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 19.0024,
    lng: 72.8427
  },
  {
    id: 'hosp-blr-victoria',
    name: 'Victoria Hospital & Trauma Care Centre',
    type: 'Government Apex Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Fort Road, near City Market, Kalasipalya, Bengaluru 560002',
    phone: '080-26701150',
    emergencyPhone: '080-26701151',
    has24x7Emergency: true,
    bloodBankAvailable: true,
    lat: 12.9629,
    lng: 77.5753
  }
];

export interface PublicServicePortal {
  id: string;
  name: string;
  category: 'Citizen Grievance' | 'Transport & Highway' | 'Healthcare' | 'Sanitation' | 'Digital Identity';
  jurisdiction: 'National (Central Govt)' | 'State Government' | 'Municipal Corporation';
  description: string;
  url: string;
  officialDisclaimer: string;
}

export const verifiedPublicServices: PublicServicePortal[] = [
  {
    id: 'pub-cpgrams',
    name: 'CPGRAMS (Centralized Public Grievance Redress and Monitoring System)',
    category: 'Citizen Grievance',
    jurisdiction: 'National (Central Govt)',
    description: 'Official 24x7 online portal of Government of India to lodge grievances against any Central/State Ministry or Department.',
    url: 'https://pgportal.gov.in',
    officialDisclaimer: 'Government portal administered by DARPG. RAKSHAK does not represent or replace CPGRAMS officers.'
  },
  {
    id: 'pub-swachhata',
    name: 'Swachhata-MoHUA Citizen App',
    category: 'Sanitation',
    jurisdiction: 'Municipal Corporation',
    description: 'Official portal by Ministry of Housing and Urban Affairs for garbage, public toilets, and sanitation complaints.',
    url: 'https://swachhata.app',
    officialDisclaimer: 'Official platform by MoHUA India. Complaints submitted here go directly to ward sanitary inspectors.'
  },
  {
    id: 'pub-parivahan',
    name: 'Parivahan Sewa (MoRTH)',
    category: 'Transport & Highway',
    jurisdiction: 'National (Central Govt)',
    description: 'Driving license, vehicle registration, road safety certificates, and transport services across all states.',
    url: 'https://parivahan.gov.in',
    officialDisclaimer: 'Official portal of Ministry of Road Transport and Highways. RAKSHAK cannot issue licenses or alter RTO records.'
  },
  {
    id: 'pub-ehospital',
    name: 'e-Hospital (NIC National Health Portal)',
    category: 'Healthcare',
    jurisdiction: 'National (Central Govt)',
    description: 'Online OPD registration, lab test reports, and blood availability across major government hospitals in India.',
    url: 'https://ehospital.gov.in',
    officialDisclaimer: 'Administered by National Informatics Centre (NIC). Appointment verification is managed by hospital authorities.'
  },
  {
    id: 'pub-umang',
    name: 'UMANG (Unified Mobile Application for New-age Governance)',
    category: 'Citizen Grievance',
    jurisdiction: 'National (Central Govt)',
    description: 'Single platform access to over 1,200 central and state government citizen services, PF, PAN, pensions, and utility bills.',
    url: 'https://web.umang.gov.in',
    officialDisclaimer: 'Developed by Ministry of Electronics and Information Technology (MeitY) and NeGD.'
  },
  {
    id: 'pub-digilocker',
    name: 'DigiLocker India',
    category: 'Digital Identity',
    jurisdiction: 'National (Central Govt)',
    description: 'Flagship initiative under Digital India providing authentic digital documents like Aadhaar, Driving License, and RC.',
    url: 'https://www.digilocker.gov.in',
    officialDisclaimer: 'MeitY official initiative. Legally valid under Rule 9A of IT Rules 2016.'
  }
];
