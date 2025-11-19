import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { CheckIcon, UsersIcon, AwardIcon, HeartIcon, BookOpenIcon, ShieldIcon, StarIcon, ArrowRightIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { EnrollForm } from '../components/EnrollForm';
import { fetchPageContent } from '../lib/pageContent';
import { resolveMediaUrl } from '../lib/media';
import { getApiBaseUrl } from '../lib/config';

type IndividualFormState = {
  // Applicant Personal Information
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  county: string;
  subCounty: string;
  ward: string;
  diasporaCountry: string;
  
  // Ministry/Church Details
  churchName: string;
  title: string;
  titleOther: string;
  
  // Referral Details
  referralName: string;
  referralApeckNumber: string;
  referralPhone: string;
  
  // Payment
  mpesaCode: string;
  
  // Declaration
  signature: string;
  declarationDate: string;
};

type HousingFormState = {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  county: string;
  subCounty: string;
  ward: string;
  diasporaCountry: string;
  referralName: string;
  referralIdNumber: string;
  referralPhone: string;
  signature: string;
  declarationDate: string;
};

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const PAYSTACK_PUBLIC_KEY =
  ((import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ?? '').trim();
const APPLICATION_EMAIL = 'membership@apeck.org'; // TODO: Replace with official intake email
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScI8o9LqnLQDI3TxtEL8BRuhvsfQn-dp2rTZ7cWkoxlQ9nNpQ/viewform';

// Helper function to parse price from priceLabel (e.g., "KSh 1,050" -> 1050)
function parsePriceFromLabel(priceLabel: string): number {
  // Remove currency symbols, spaces, and commas, then extract number
  const cleaned = priceLabel.replace(/[^\d.]/g, '');
  const amount = parseFloat(cleaned);
  return isNaN(amount) ? 0 : Math.round(amount);
}
const initialIndividualForm: IndividualFormState = {
  // Applicant Personal Information
  fullName: '',
  idNumber: '',
  phone: '',
  email: '',
  county: '',
  subCounty: '',
  ward: '',
  diasporaCountry: '',
  
  // Ministry/Church Details
  churchName: '',
  title: '',
  titleOther: '',
  
  // Referral Details
  referralName: '',
  referralApeckNumber: '',
  referralPhone: '',
  
  // Payment
  mpesaCode: '',
  
  // Declaration
  signature: '',
  declarationDate: new Date().toISOString().split('T')[0], // Today's date as default
};

const initialHousingForm: HousingFormState = {
  fullName: '',
  idNumber: '',
  phone: '',
  email: '',
  county: '',
  subCounty: '',
  ward: '',
  diasporaCountry: '',
  referralName: '',
  referralIdNumber: '',
  referralPhone: '',
  signature: '',
  declarationDate: new Date().toISOString().split('T')[0],
};

type CorporateOfficial = {
  fullName: string;
  idNumber: string;
  kraPin: string;
  phone: string;
  email: string;
};

type CorporateFormState = {
  organizationName: string;
  registrationCertificateNumber: string;
  organizationKraPin: string;
  headquartersLocation: string;
  county: string;
  subCounty: string;
  organizationEmail: string;
  organizationPhone: string;
  chairperson: CorporateOfficial;
  secretary: CorporateOfficial;
  treasurer: CorporateOfficial;
  amountPaid: number;
};

const initialCorporateOfficial: CorporateOfficial = {
  fullName: '',
  idNumber: '',
  kraPin: '',
  phone: '',
  email: '',
};

const initialCorporateForm: CorporateFormState = {
  organizationName: '',
  registrationCertificateNumber: '',
  organizationKraPin: '',
  headquartersLocation: '',
  county: '',
  subCounty: '',
  organizationEmail: '',
  organizationPhone: '',
  chairperson: { ...initialCorporateOfficial },
  secretary: { ...initialCorporateOfficial },
  treasurer: { ...initialCorporateOfficial },
  amountPaid: 0,
};

const createCorporateFormState = (overrides?: Partial<CorporateFormState>): CorporateFormState => ({
  ...initialCorporateForm,
  ...overrides,
  chairperson: {
    ...initialCorporateForm.chairperson,
    ...(overrides?.chairperson ?? {}),
  },
  secretary: {
    ...initialCorporateForm.secretary,
    ...(overrides?.secretary ?? {}),
  },
  treasurer: {
    ...initialCorporateForm.treasurer,
    ...(overrides?.treasurer ?? {}),
  },
});

const KENYAN_COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  "Murang'a",
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
];

const SUB_COUNTIES: Record<string, string[]> = {
  Baringo: ['Baringo North', 'Baringo South', 'Eldama Ravine', 'Mogotio', 'Tiaty'],
  Bomet: ['Bomet Central', 'Bomet East', 'Chepalungu', 'Konoin', 'Sotik'],
  Bungoma: ['Bumula', 'Kabuchai', 'Kanduyi', 'Kimilili', 'Mt. Elgon', 'Sirisia', 'Tongaren', 'Webuye East', 'Webuye West'],
  Busia: ['Budalangi', 'Butula', 'Funyula', 'Matayos', 'Nambale', 'Teso North', 'Teso South'],
  'Elgeyo-Marakwet': ['Keiyo North', 'Keiyo South', 'Marakwet East', 'Marakwet West'],
  Embu: ['Manyatta', 'Mbeere North', 'Mbeere South', 'Runyenjes'],
  Garissa: ['Balambala', 'Dadaab', 'Fafi', 'Garissa Township', 'Hulugho', 'Ijara', 'Lagdera'],
  'Homa Bay': ['Homa Bay Town', 'Kabondo Kasipul', 'Karachuonyo', 'Kasipul', 'Mbita', 'Ndhiwa', 'Rachuonyo South', 'Rangwe', 'Suba North', 'Suba South'],
  Isiolo: ['Isiolo', 'Merti', 'Garbatulla'],
  Kajiado: ['Kajiado Central', 'Kajiado East', 'Kajiado North', 'Kajiado South', 'Kajiado West'],
  Kakamega: ['Butere', 'Ikolomani', 'Khwisero', 'Lugari', 'Lurambi', 'Malava', 'Matungu', 'Mumias East', 'Mumias West', 'Likuyani', 'Navakholo', 'Shinyalu'],
  Kericho: ['Ainamoi', 'Belgut', 'Bureti', 'Kipkelion East', 'Kipkelion West', 'Sigowet-Soin'],
  Kiambu: ['Gatundu North', 'Gatundu South', 'Githunguri', 'Juja', 'Kabete', 'Kiambaa', 'Kiambu', 'Kikuyu', 'Limuru', 'Lari', 'Ruiru', 'Thika Town'],
  Kilifi: ['Kaloleni', 'Kilifi North', 'Kilifi South', 'Magarini', 'Malindi', 'Rabai'],
  Kirinyaga: ['Gichugu', 'Kirinyaga Central', 'Mwea East', 'Mwea West', 'Ndia'],
  Kisii: ['Bonchari', 'Bomachoge Borabu', 'Bomachoge Chache', 'Kitutu Chache North', 'Kitutu Chache South', 'Nyaribari Chache', 'Nyaribari Masaba', 'South Mugirango'],
  Kisumu: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Muhoroni', 'Nyakach', 'Nyando', 'Seme'],
  Kitui: ['Kitui Central', 'Kitui East', 'Kitui Rural', 'Kitui South', 'Kitui West', 'Mwingi Central', 'Mwingi North', 'Mwingi West'],
  Kwale: ['Kinango', 'Lunga Lunga', 'Msambweni', 'Matuga'],
  Laikipia: ['Laikipia East', 'Laikipia North', 'Laikipia West', 'Nyahururu'],
  Lamu: ['Lamu East', 'Lamu West'],
  Machakos: ['Athi River', 'Kangundo', 'Kathiani', 'Machakos Town', 'Masinga', 'Matungulu', 'Mavoko', 'Mwala', 'Yatta'],
  Makueni: ['Kaiti', 'Kibwezi East', 'Kibwezi West', 'Kilome', 'Makueni', 'Mbooni'],
  Mandera: ['Banissa', 'Lafey', 'Mandera East', 'Mandera North', 'Mandera South', 'Mandera West'],
  Marsabit: ['Laisamis', 'Moyale', 'North Horr', 'Saku'],
  Meru: ['Buuri', 'Igembe Central', 'Igembe North', 'Igembe South', 'Imenti Central', 'Imenti North', 'Imenti South', 'Tigania East', 'Tigania West'],
  Migori: ['Awendo', 'Kuria East', 'Kuria West', 'Nyatike', 'Rongo', 'Suna East', 'Suna West', 'Uriri'],
  Mombasa: ['Changamwe', 'Jomvu', 'Kisauni', 'Likoni', 'Mvita', 'Nyali'],
  "Murang'a": ['Gatanga', 'Kandara', 'Kangema', 'Kigumo', 'Kiharu', 'Mathioya', 'Maragua'],
  Nairobi: ['Dagoretti North', 'Dagoretti South', 'Embakasi Central', 'Embakasi East', 'Embakasi North', 'Embakasi South', 'Embakasi West', 'Kasarani', 'Kamukunji', 'Langata', 'Makadara', 'Mathare', 'Roysambu', 'Ruaraka', 'Starehe', 'Westlands'],
  Nakuru: ['Bahati', 'Gilgil', 'Kuresoi North', 'Kuresoi South', 'Molo', 'Naivasha', 'Nakuru Town East', 'Nakuru Town West', 'Njoro', 'Rongai', 'Subukia'],
  Nandi: ['Aldai', 'Chesumei', 'Emgwen', 'Mosop', 'Nandi Hills', 'Tinderet'],
  Narok: ['Emurua Dikirr', 'Kilgoris', 'Narok East', 'Narok North', 'Narok South', 'Narok West'],
  Nyamira: ['Borabu', 'Manga', 'Masaba North', 'Nyamira North', 'Nyamira South'],
  Nyandarua: ['Kinangop', 'Kipipiri', 'Mirangine', 'Ndaragwa', 'Ol Jorok', 'Ol Kalou'],
  Nyeri: ['Kieni East', 'Kieni West', 'Mathira East', 'Mathira West', 'Mukurweini', 'Nyeri Town', 'Othaya', 'Tetu'],
  Samburu: ['Samburu East', 'Samburu North', 'Samburu West'],
  Siaya: ['Alego Usonga', 'Bondo', 'Gem', 'Rarieda', 'Ugenya', 'Ugunja'],
  'Taita-Taveta': ['Mwatate', 'Taveta', 'Voi', 'Wundanyi'],
  'Tana River': ['Bura', 'Galole', 'Garsen'],
  'Tharaka-Nithi': ["Chuka/Igambang'ombe", 'Maara', 'Tharaka North', 'Tharaka South'],
  'Trans Nzoia': ['Cherangany', 'Endebess', 'Kiminini', 'Kwanza', 'Saboti'],
  Turkana: ['Loima', 'Turkana Central', 'Turkana East', 'Turkana North', 'Turkana South', 'Turkana West'],
  'Uasin Gishu': ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
  Vihiga: ['Emuhaya', 'Hamisi', 'Luanda', 'Sabatia', 'Vihiga'],
  Wajir: ['Eldas', 'Tarbaj', 'Wajir East', 'Wajir North', 'Wajir South', 'Wajir West'],
  'West Pokot': ['Kapenguria', 'Kipkomo', 'Pokot South', 'Sigor'],
};

const WARDS: Record<string, Record<string, string[]>> = {
  Nairobi: {
    'Dagoretti North': ['Kileleshwa', 'Kilimani', 'Kabiro'],
    'Dagoretti South': ['Mutu-Ini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka'],
    'Embakasi Central': ['Kayole North', 'Kayole South', 'Komarock', 'Matopeni', 'Upper Savannah'],
    'Embakasi East': ['Utawala', 'Embakasi', 'Mihango', 'Kayole North', 'Kayole Central'],
    'Embakasi North': ['Dandora Area I', 'Dandora Area II', 'Dandora Area III', 'Dandora Area IV', 'Kariobangi North'],
    'Embakasi South': ['Imara Daima', 'Kwa Njenga', 'Kwa Rueben', 'Pipeline', 'Kware'],
    'Embakasi West': ['Umoja I', 'Umoja II', 'Mowlem', 'Kariobangi South'],
    Kasarani: ['Clay City', 'Kasarani', 'Mwiki', 'Njiru', 'Ruai'],
    Kamukunji: ['Airbase', 'California', 'Eastleigh North', 'Eastleigh South', 'Pumwani'],
    Langata: ['Karen', 'Langata', 'Nairobi West', 'South C'],
    Makadara: ['Harambee', 'Makongeni', 'Maringo/Hamza', 'Viwandani'],
    Mathare: ['Hospital', 'Huruma', 'Kiamaiko', 'Mabatini', 'Mlango Kubwa', 'Ngei'],
    Roysambu: ['Roysambu', 'Kahawa', 'Zimmerman', 'Githurai', 'Kahawa West'],
    Ruaraka: ["Baba Dogo", 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho'],
    Starehe: ['Nairobi Central', 'Ngara', 'Pangani', 'Landimawe', 'Nairobi South'],
    Westlands: ['Kangemi', 'Kitisuru', 'Mountain View', 'Parklands/Highridge', 'Karura'],
  },
  Kiambu: {
    'Kiambu': ['Riabai', 'Township', 'Ndumberi'],
    'Ruiru': ['Biashara', 'Gitothua', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani', 'Kiuu', 'Mwiki', 'Umoja'],
    'Thika Town': ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga'],
    'Gatundu South': ['Kiamwangi', 'Kiganjo', 'Ndarugo'],
    'Limuru': ['Limuru Central', 'Ndeiya', 'Bibirioni', 'Ngecha Tigoni', 'Limuru East'],
  },
  Mombasa: {
    Changamwe: ['Airport', 'Changamwe', 'Chaani', 'Kipevu', 'Port Reitz'],
    Jomvu: ['Jomvu Kuu', 'Miritini', 'Mikindani'],
    Kisauni: ['Bamburi', 'Mjambere', 'Mwakirunge', 'Shanzu'],
    Likoni: ['Bofu', 'Mtongwe', 'Likoni', 'Shika Adabu'],
    Mvita: ['Buxton', 'Frere Town', 'Ganjoni', 'Kizingo', 'Mji Wa Kale/Makadara', 'Tudor'],
    Nyali: ['Frere Town', 'Kongowea', 'Kadzandani'],
  },
  'Homa Bay': {
    'Homa Bay Town': ['Central', 'Kalanya', 'Karachuonyo Central', 'Homa Bay West'],
    'Rangwe': ['East Rangwe', 'Kanyadoto', 'Kanyikela'],
    Ndhiwa: ['Kanyamwa Kologi', 'Kanyamwa Kosewe', 'Kabuoch North', 'Kabuoch South'],
  },
  Nakuru: {
    'Nakuru Town East': ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai'],
    'Nakuru Town West': ['Barut', 'Kaptembwo', 'London', 'Rhoda', 'Shabaab'],
    Naivasha: ['Biashara', 'Hells Gate', 'Maiella', 'Mai Mahiu', 'Ol Karia', 'Naivasha East'],
    Bahati: ['Bahati', 'Dundori', 'Kabazi', 'Lanet/Umoja', 'Murarandia'],
  },
  Kisumu: {
    'Kisumu Central': ['Market Milimani', 'Kondele', 'Railways', 'Shauri Moyo-Kaloleni'],
    'Kisumu East': ['Kajulu', 'Kolwa East', 'Manyatta B', 'Nyalenda A'],
    'Kisumu West': ['Central Kisumu', 'Kisumu North', 'West Kisumu', 'North West Kisumu'],
  },
};

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Republic)',
  'Congo (Democratic Republic)',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini (Swaziland)',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Other',
];

export function Membership() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedTierAmount, setSelectedTierAmount] = useState<number>(0);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showHousingModal, setShowHousingModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [individualForm, setIndividualForm] = useState<IndividualFormState>(initialIndividualForm);
  const [housingForm, setHousingForm] = useState<HousingFormState>(initialHousingForm);
  const [corporateForm, setCorporateForm] = useState<CorporateFormState>(() =>
    createCorporateFormState(),
  );
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isCountyDropdownOpen, setIsCountyDropdownOpen] = useState(false);
  const [countySearchTerm, setCountySearchTerm] = useState('');
  const [isSubCountyDropdownOpen, setIsSubCountyDropdownOpen] = useState(false);
  const [subCountySearchTerm, setSubCountySearchTerm] = useState('');
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);
  const [wardSearchTerm, setWardSearchTerm] = useState('');
  const [isHousingCountryDropdownOpen, setIsHousingCountryDropdownOpen] = useState(false);
  const [housingCountrySearchTerm, setHousingCountrySearchTerm] = useState('');
  const [isHousingCountyDropdownOpen, setIsHousingCountyDropdownOpen] = useState(false);
  const [housingCountySearchTerm, setHousingCountySearchTerm] = useState('');
  const [isHousingSubCountyDropdownOpen, setIsHousingSubCountyDropdownOpen] = useState(false);
  const [housingSubCountySearchTerm, setHousingSubCountySearchTerm] = useState('');
  const [isHousingWardDropdownOpen, setIsHousingWardDropdownOpen] = useState(false);
  const [housingWardSearchTerm, setHousingWardSearchTerm] = useState('');
  const [isCorporatePaying, setIsCorporatePaying] = useState(false);
  const [corporatePaymentReference, setCorporatePaymentReference] = useState<string | null>(null);
  const [corporatePaymentMessage, setCorporatePaymentMessage] = useState<string | null>(null);
  const [isSubmittingCorporateApplication, setIsSubmittingCorporateApplication] = useState(false);
  const [housingPaymentMessage, setHousingPaymentMessage] = useState<string | null>(null);
  const [isHousingPaying, setIsHousingPaying] = useState(false);
  const [housingPaymentReference, setHousingPaymentReference] = useState<string | null>(null);
  const [isSubmittingHousingApplication, setIsSubmittingHousingApplication] = useState(false);
  const [isCorporateCountyDropdownOpen, setIsCorporateCountyDropdownOpen] = useState(false);
  const [corporateCountySearchTerm, setCorporateCountySearchTerm] = useState('');
  const [isCorporateSubCountyDropdownOpen, setIsCorporateSubCountyDropdownOpen] = useState(false);
  const [corporateSubCountySearchTerm, setCorporateSubCountySearchTerm] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const countyDropdownRef = useRef<HTMLDivElement | null>(null);
  const subCountyDropdownRef = useRef<HTMLDivElement | null>(null);
  const wardDropdownRef = useRef<HTMLDivElement | null>(null);
  const corporateCountyDropdownRef = useRef<HTMLDivElement | null>(null);
  const corporateSubCountyDropdownRef = useRef<HTMLDivElement | null>(null);
  const housingCountryDropdownRef = useRef<HTMLDivElement | null>(null);
  const housingCountyDropdownRef = useRef<HTMLDivElement | null>(null);
  const housingSubCountyDropdownRef = useRef<HTMLDivElement | null>(null);
  const housingWardDropdownRef = useRef<HTMLDivElement | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});

  // Pattern components (memoized for performance)
  const DottedPattern = memo(({ className = '', size = '24px', opacity = 0.03 }: { className?: string; size?: string; opacity?: number }) => (
    <div className={`absolute inset-0 ${className}`} style={{
      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
      backgroundSize: `${size} ${size}`,
      opacity: opacity,
      willChange: 'opacity',
    }}></div>
  ));
  DottedPattern.displayName = 'DottedPattern';

  const GeometricPattern = memo(({ className = '', opacity = 0.02 }: { className?: string; opacity?: number }) => {
    const patternId = useMemo(() => `geometric-pattern-${Math.random().toString(36).substr(2, 9)}`, []);
    return (
      <div className={`absolute inset-0 ${className}`} style={{ opacity, willChange: 'opacity' }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={patternId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,0 60,30 30,60 0,30" fill="none" stroke="#8B2332" strokeWidth="0.5" opacity="0.3"/>
              <polygon points="15,0 30,15 15,30 0,15" fill="none" stroke="#7A7A3F" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  });
  GeometricPattern.displayName = 'GeometricPattern';

  const AbstractShape = memo(({ position = 'right', color = '#8B2332' }: { position?: 'left' | 'right' | 'top' | 'bottom'; color?: string }) => {
    const positions = {
      right: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
      left: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
    };

    return (
      <div className={`absolute ${positions[position]} w-64 h-64 md:w-96 md:h-96 opacity-5`} style={{ willChange: 'transform' }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M 100,0 Q 150,50 150,100 Q 150,150 100,150 Q 50,150 50,100 Q 50,50 100,0 Z"
            fill={color}
            opacity="0.08"
          />
          <path
            d="M 80,20 Q 130,70 130,120 Q 130,170 80,130 Q 30,130 30,80 Q 30,30 80,20 Z"
            fill={color === '#8B2332' ? '#7A7A3F' : '#8B2332'}
            opacity="0.06"
          />
        </svg>
      </div>
    );
  });
  AbstractShape.displayName = 'AbstractShape';

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisible: { [key: string]: boolean } = {};
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id) newVisible[id] = true;
            observerRef.current?.unobserve(entry.target);
          }
        });
        setIsVisible((prev) => ({ ...prev, ...newVisible }));
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Load Paystack inline script
  useEffect(() => {
    const scriptId = 'paystack-inline';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;

    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (countyDropdownRef.current && !countyDropdownRef.current.contains(event.target as Node)) {
        setIsCountyDropdownOpen(false);
      }
      if (subCountyDropdownRef.current && !subCountyDropdownRef.current.contains(event.target as Node)) {
        setIsSubCountyDropdownOpen(false);
      }
      if (wardDropdownRef.current && !wardDropdownRef.current.contains(event.target as Node)) {
        setIsWardDropdownOpen(false);
      }
      if (
        corporateCountyDropdownRef.current &&
        !corporateCountyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCorporateCountyDropdownOpen(false);
      }
      if (
        corporateSubCountyDropdownRef.current &&
        !corporateSubCountyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCorporateSubCountyDropdownOpen(false);
      }
      if (
        housingCountryDropdownRef.current &&
        !housingCountryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHousingCountryDropdownOpen(false);
      }
      if (
        housingCountyDropdownRef.current &&
        !housingCountyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHousingCountyDropdownOpen(false);
      }
      if (
        housingSubCountyDropdownRef.current &&
        !housingSubCountyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHousingSubCountyDropdownOpen(false);
      }
      if (
        housingWardDropdownRef.current &&
        !housingWardDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHousingWardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (individualForm.diasporaCountry) {
      setIsCountryDropdownOpen(false);
    }
  }, [individualForm.diasporaCountry]);

  useEffect(() => {
    if (individualForm.county) {
      setIsCountyDropdownOpen(false);
    }
  }, [individualForm.county]);

  useEffect(() => {
    if (individualForm.subCounty) {
      setIsSubCountyDropdownOpen(false);
    }
  }, [individualForm.subCounty]);

  useEffect(() => {
    if (individualForm.ward) {
      setIsWardDropdownOpen(false);
    }
  }, [individualForm.ward]);

  useEffect(() => {
    if (corporateForm.county) {
      setIsCorporateCountyDropdownOpen(false);
    }
  }, [corporateForm.county]);

  useEffect(() => {
    if (corporateForm.subCounty) {
      setIsCorporateSubCountyDropdownOpen(false);
    }
  }, [corporateForm.subCounty]);

  useEffect(() => {
    if (housingForm.diasporaCountry) {
      setIsHousingCountryDropdownOpen(false);
    }
  }, [housingForm.diasporaCountry]);

  useEffect(() => {
    if (housingForm.county) {
      setIsHousingCountyDropdownOpen(false);
    }
  }, [housingForm.county]);

  useEffect(() => {
    if (housingForm.subCounty) {
      setIsHousingSubCountyDropdownOpen(false);
    }
  }, [housingForm.subCounty]);

  useEffect(() => {
    if (housingForm.ward) {
      setIsHousingWardDropdownOpen(false);
    }
  }, [housingForm.ward]);

  const filteredCountries = useMemo(
    () =>
      COUNTRIES.filter((country) =>
        country.toLowerCase().includes(countrySearchTerm.trim().toLowerCase()),
      ),
    [countrySearchTerm],
  );

  const filteredCounties = useMemo(
    () =>
      KENYAN_COUNTIES.filter((county) =>
        county.toLowerCase().includes(countySearchTerm.trim().toLowerCase()),
      ),
    [countySearchTerm],
  );

  const filteredSubCounties = useMemo(() => {
    const subs = SUB_COUNTIES[individualForm.county] || [];
    return subs.filter((sub) => sub.toLowerCase().includes(subCountySearchTerm.trim().toLowerCase()));
  }, [individualForm.county, subCountySearchTerm]);

  const availableWards = useMemo(() => {
    const countyWards = WARDS[individualForm.county] || {};
    return countyWards[individualForm.subCounty] || [];
  }, [individualForm.county, individualForm.subCounty]);

  const filteredWards = useMemo(
    () =>
      availableWards.filter((ward) =>
        ward.toLowerCase().includes(wardSearchTerm.trim().toLowerCase()),
      ),
    [availableWards, wardSearchTerm],
  );

  const filteredCorporateCounties = useMemo(
    () =>
      KENYAN_COUNTIES.filter((county) =>
        county.toLowerCase().includes(corporateCountySearchTerm.trim().toLowerCase()),
      ),
    [corporateCountySearchTerm],
  );

  const filteredCorporateSubCounties = useMemo(() => {
    const subs = SUB_COUNTIES[corporateForm.county] || [];
    return subs.filter((sub) =>
      sub.toLowerCase().includes(corporateSubCountySearchTerm.trim().toLowerCase()),
    );
  }, [corporateForm.county, corporateSubCountySearchTerm]);

  const filteredHousingCountries = useMemo(
    () =>
      COUNTRIES.filter((country) =>
        country.toLowerCase().includes(housingCountrySearchTerm.trim().toLowerCase()),
      ),
    [housingCountrySearchTerm],
  );

  const filteredHousingCounties = useMemo(
    () =>
      KENYAN_COUNTIES.filter((county) =>
        county.toLowerCase().includes(housingCountySearchTerm.trim().toLowerCase()),
      ),
    [housingCountySearchTerm],
  );

  const filteredHousingSubCounties = useMemo(() => {
    const subs = SUB_COUNTIES[housingForm.county] || [];
    return subs.filter((sub) =>
      sub.toLowerCase().includes(housingSubCountySearchTerm.trim().toLowerCase()),
    );
  }, [housingForm.county, housingSubCountySearchTerm]);

  const housingAvailableWards = useMemo(() => {
    const countyWards = WARDS[housingForm.county] || {};
    return countyWards[housingForm.subCounty] || [];
  }, [housingForm.county, housingForm.subCounty]);

  const filteredHousingWards = useMemo(
    () =>
      housingAvailableWards.filter((ward) =>
        ward.toLowerCase().includes(housingWardSearchTerm.trim().toLowerCase()),
      ),
    [housingAvailableWards, housingWardSearchTerm],
  );

  const resetIndividualForm = () => {
    setIndividualForm(initialIndividualForm);
    setPaymentReference(null);
    setPaymentMessage(null);
    setIsPaying(false);
    setIsSubmittingApplication(false);
    setSelectedTierAmount(0);
  };

  const resetCorporateForm = () => {
    setCorporateForm(createCorporateFormState());
    setCorporatePaymentReference(null);
    setCorporatePaymentMessage(null);
    setIsCorporatePaying(false);
    setIsSubmittingCorporateApplication(false);
    setSelectedTierAmount(0);
  };

  const resetHousingForm = () => {
    setHousingForm(initialHousingForm);
    setHousingPaymentMessage(null);
  setHousingPaymentReference(null);
  setIsHousingPaying(false);
    setIsSubmittingHousingApplication(false);
    setSelectedTierAmount(0);
  };

  const handleSelectCountry = (country: string) => {
    setIndividualForm((prev) => ({
      ...prev,
      diasporaCountry: country,
    }));
    setCountrySearchTerm('');
    setIsCountryDropdownOpen(false);
  };

  const handleSelectCounty = (county: string) => {
    setIndividualForm((prev) => ({
      ...prev,
      county,
      // Reset sub-county when county changes
      subCounty: '',
    }));
    setCountySearchTerm('');
    setIsCountyDropdownOpen(false);
  };

  const handleSelectSubCounty = (subCounty: string) => {
    setIndividualForm((prev) => ({
      ...prev,
      subCounty,
      ward: '',
    }));
    setSubCountySearchTerm('');
    setIsSubCountyDropdownOpen(false);
  };

  const handleSelectWard = (ward: string) => {
    setIndividualForm((prev) => ({
      ...prev,
      ward,
    }));
    setWardSearchTerm('');
    setIsWardDropdownOpen(false);
  };

  const handleSelectCorporateCounty = (county: string) => {
    setCorporateForm((prev) => ({
      ...prev,
      county,
      subCounty: '',
    }));
    setCorporateCountySearchTerm('');
    setIsCorporateCountyDropdownOpen(false);
  };

  const handleSelectCorporateSubCounty = (subCounty: string) => {
    setCorporateForm((prev) => ({
      ...prev,
      subCounty,
    }));
    setCorporateSubCountySearchTerm('');
    setIsCorporateSubCountyDropdownOpen(false);
  };

  const handleIndividualInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIndividualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCorporateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'amountPaid') {
      const numericValue = Number(value.replace(/,/g, ''));
      setCorporateForm((prev) => ({
        ...prev,
        amountPaid: Number.isNaN(numericValue) ? 0 : numericValue,
      }));
      return;
    }
    setCorporateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCorporateOfficialChange = (
    role: 'chairperson' | 'secretary' | 'treasurer',
    field: keyof CorporateOfficial,
    value: string,
  ) => {
    setCorporateForm((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  const handleHousingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHousingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHousingPaystackPayment = () => {
    if (!housingForm.email || !housingForm.phone || !housingForm.fullName) {
      setHousingPaymentMessage('Please fill in your full name, phone, and email before initiating payment.');
      return;
    }
    const paymentAmount = selectedTierAmount || 5000;
    if (!paymentAmount || paymentAmount <= 0) {
      setHousingPaymentMessage('Invalid membership tier amount. Please try again.');
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      setHousingPaymentMessage('Payment gateway is not configured. Please contact support.');
      return;
    }
    if (!window.PaystackPop) {
      setHousingPaymentMessage('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    setIsHousingPaying(true);
    setHousingPaymentMessage(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: housingForm.email,
      amount: paymentAmount * 100,
      currency: 'KES',
      reference: `APECK-HOUSING-${Date.now()}`,
      label: housingForm.fullName,
      metadata: {
        custom_fields: [
          {
            display_name: 'Applicant Phone',
            variable_name: 'applicant_phone',
            value: housingForm.phone,
          },
          {
            display_name: 'Membership Tier',
            variable_name: 'membership_tier',
            value: selectedTier || 'Housing Corporations',
          },
        ],
      },
      callback: (response: { reference: string }) => {
        setIsHousingPaying(false);
        setHousingPaymentReference(response.reference);
        setHousingPaymentMessage('Payment verified! Reference: ' + response.reference);
      },
      onClose: () => {
        setIsHousingPaying(false);
        if (!housingPaymentReference) {
          setHousingPaymentMessage('Payment window closed before completion.');
        }
      },
    });

    handler.openIframe();
  };

  const handleSelectHousingCountry = (country: string) => {
    setHousingForm((prev) => ({
      ...prev,
      diasporaCountry: country,
    }));
    setHousingCountrySearchTerm('');
    setIsHousingCountryDropdownOpen(false);
  };

  const handleSelectHousingCounty = (county: string) => {
    setHousingForm((prev) => ({
      ...prev,
      county,
      subCounty: '',
      ward: '',
    }));
    setHousingCountySearchTerm('');
    setIsHousingCountyDropdownOpen(false);
  };

  const handleSelectHousingSubCounty = (subCounty: string) => {
    setHousingForm((prev) => ({
      ...prev,
      subCounty,
      ward: '',
    }));
    setHousingSubCountySearchTerm('');
    setIsHousingSubCountyDropdownOpen(false);
  };

  const handleSelectHousingWard = (ward: string) => {
    setHousingForm((prev) => ({
      ...prev,
      ward,
    }));
    setHousingWardSearchTerm('');
    setIsHousingWardDropdownOpen(false);
  };

  const handlePaystackPayment = () => {
    if (!individualForm.email || !individualForm.phone || !individualForm.fullName) {
      setPaymentMessage('Please fill in your name, phone, and email before initiating payment.');
      return;
    }
    if (!selectedTierAmount || selectedTierAmount <= 0) {
      setPaymentMessage('Invalid membership tier amount. Please try again.');
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      setPaymentMessage('Payment gateway is not configured. Please contact support.');
      return;
    }
    if (!window.PaystackPop) {
      setPaymentMessage('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    setIsPaying(true);
    setPaymentMessage(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: individualForm.email,
      amount: selectedTierAmount * 100, // Paystack accepts amount in base currency minor units
      currency: 'KES',
      reference: `APECK-${selectedTier?.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`,
      label: individualForm.fullName,
      metadata: {
        custom_fields: [
          { display_name: 'Phone Number', variable_name: 'phone_number', value: individualForm.phone },
          { display_name: 'Membership Tier', variable_name: 'membership_tier', value: selectedTier || '' },
        ],
      },
      callback: (response: { reference: string }) => {
        setIsPaying(false);
        setPaymentReference(response.reference);
        setPaymentMessage('Payment verified! Reference: ' + response.reference);
      },
      onClose: () => {
        setIsPaying(false);
        if (!paymentReference) {
          setPaymentMessage('Payment window closed before completion.');
        }
      },
    });

    handler.openIframe();
  };

  const handleCorporatePaystackPayment = () => {
    if (
      !corporateForm.organizationEmail ||
      !corporateForm.organizationPhone ||
      !corporateForm.organizationName
    ) {
      setCorporatePaymentMessage(
        'Please fill in the organization name, phone, and email before initiating payment.',
      );
      return;
    }
    const paymentAmount = corporateForm.amountPaid || selectedTierAmount;
    if (!paymentAmount || paymentAmount <= 0) {
      setCorporatePaymentMessage('Invalid membership tier amount. Please try again.');
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      setCorporatePaymentMessage('Payment gateway is not configured. Please contact support.');
      return;
    }
    if (!window.PaystackPop) {
      setCorporatePaymentMessage('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    setIsCorporatePaying(true);
    setCorporatePaymentMessage(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: corporateForm.organizationEmail,
      amount: paymentAmount * 100,
      currency: 'KES',
      reference: `APECK-CORP-${Date.now()}`,
      label: corporateForm.organizationName,
      metadata: {
        custom_fields: [
          { display_name: 'Organization Phone', variable_name: 'organization_phone', value: corporateForm.organizationPhone },
          {
            display_name: 'Membership Tier',
            variable_name: 'membership_tier',
            value: selectedTier || 'Corporate Membership',
          },
        ],
      },
      callback: (response: { reference: string }) => {
        setIsCorporatePaying(false);
        setCorporatePaymentReference(response.reference);
        setCorporatePaymentMessage('Payment verified! Reference: ' + response.reference);
      },
      onClose: () => {
        setIsCorporatePaying(false);
        if (!corporatePaymentReference) {
          setCorporatePaymentMessage('Payment window closed before completion.');
        }
      },
    });

    handler.openIframe();
  };

  const closeIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedTier(null);
    setSelectedTierAmount(0);
    resetIndividualForm();
  };

  const closeCorporateModal = () => {
    setShowCorporateModal(false);
    setSelectedTier(null);
    setSelectedTierAmount(0);
    resetCorporateForm();
  };

  const closeHousingModal = () => {
    setShowHousingModal(false);
    setSelectedTier(null);
    setSelectedTierAmount(0);
    resetHousingForm();
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Require Paystack payment reference (manual payments disabled)
    if (!paymentReference) {
      setPaymentMessage('Please complete your Paystack payment before submitting the application.');
      return;
    }

    setIsSubmittingApplication(true);
    setPaymentMessage(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/membership/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: individualForm.fullName,
          phone: individualForm.phone,
          idNumber: individualForm.idNumber,
          email: individualForm.email,
          county: individualForm.county,
          subCounty: individualForm.subCounty || undefined,
          ward: individualForm.ward || undefined,
          diasporaCountry: individualForm.diasporaCountry || undefined,
          mpesaCode: individualForm.mpesaCode || undefined,
          paymentReference: paymentReference,
          paymentGateway: 'paystack',
          amountPaid: selectedTierAmount || 0,
          membershipTier: selectedTier ?? 'Individual Member',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      if (data.success) {
        setPaymentMessage('Application submitted successfully! You will receive a confirmation email shortly.');
        // Reset form and close modal after a short delay
        setTimeout(() => {
          resetIndividualForm();
          setPaymentReference(null);
    closeIndividualModal();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setPaymentMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to submit application. Please try again or contact support.'
      );
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!corporatePaymentReference) {
      setCorporatePaymentMessage('Please complete your Paystack payment before submitting the application.');
      return;
    }

    setIsSubmittingCorporateApplication(true);
    setCorporatePaymentMessage(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/membership/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: corporateForm.organizationName,
          phone: corporateForm.organizationPhone,
          idNumber: corporateForm.registrationCertificateNumber,
          email: corporateForm.organizationEmail,
          county: corporateForm.county,
          subCounty: corporateForm.subCounty || undefined,
          paymentReference: corporatePaymentReference,
          paymentGateway: 'paystack',
          amountPaid: selectedTierAmount,
          membershipTier: selectedTier ?? 'Corporate Membership',
          organizationName: corporateForm.organizationName,
          organizationRegistrationNumber: corporateForm.registrationCertificateNumber,
          organizationKraPin: corporateForm.organizationKraPin || undefined,
          headquartersLocation: corporateForm.headquartersLocation || undefined,
          organizationEmail: corporateForm.organizationEmail,
          organizationPhone: corporateForm.organizationPhone,
          chairpersonName: corporateForm.chairperson.fullName,
          chairpersonIdNumber: corporateForm.chairperson.idNumber,
          chairpersonKraPin: corporateForm.chairperson.kraPin,
          chairpersonPhone: corporateForm.chairperson.phone,
          chairpersonEmail: corporateForm.chairperson.email,
          secretaryName: corporateForm.secretary.fullName,
          secretaryIdNumber: corporateForm.secretary.idNumber,
          secretaryKraPin: corporateForm.secretary.kraPin,
          secretaryPhone: corporateForm.secretary.phone,
          secretaryEmail: corporateForm.secretary.email,
          treasurerName: corporateForm.treasurer.fullName,
          treasurerIdNumber: corporateForm.treasurer.idNumber,
          treasurerKraPin: corporateForm.treasurer.kraPin,
          treasurerPhone: corporateForm.treasurer.phone,
          treasurerEmail: corporateForm.treasurer.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      if (data.success) {
        setCorporatePaymentMessage(
          'Application submitted successfully! You will receive a confirmation email shortly.',
        );
        setTimeout(() => {
          resetCorporateForm();
          setCorporatePaymentReference(null);
          closeCorporateModal();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting corporate application:', error);
      setCorporatePaymentMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to submit application. Please try again or contact support.',
      );
    } finally {
      setIsSubmittingCorporateApplication(false);
    }
  };

  const handleHousingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!housingPaymentReference) {
      setHousingPaymentMessage('Please complete your Paystack payment before submitting the application.');
      return;
    }

    setIsSubmittingHousingApplication(true);
    setHousingPaymentMessage(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/membership/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: housingForm.fullName,
          idNumber: housingForm.idNumber,
          phone: housingForm.phone,
          email: housingForm.email,
          county: housingForm.county,
          subCounty: housingForm.subCounty || undefined,
          ward: housingForm.ward || undefined,
          diasporaCountry: housingForm.diasporaCountry || undefined,
          referralName: housingForm.referralName || undefined,
          referralIdNumber: housingForm.referralIdNumber || undefined,
          referralPhone: housingForm.referralPhone || undefined,
          paymentReference: housingPaymentReference,
          paymentGateway: 'paystack',
          amountPaid: selectedTierAmount || 5000,
          membershipTier: selectedTier ?? 'Housing Corporations',
          signature: housingForm.signature,
          declarationDate: housingForm.declarationDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      if (data.success) {
        setHousingPaymentMessage(
          'Application submitted successfully! You will receive a confirmation email shortly.',
        );
        setTimeout(() => {
          resetHousingForm();
          closeHousingModal();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting housing application:', error);
      setHousingPaymentMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to submit application. Please try again or contact support.',
      );
    } finally {
      setIsSubmittingHousingApplication(false);
    }
  };

  const triggerIndividualApplication = (tierName?: string, tierPriceLabel?: string) => {
    resetIndividualForm();
    const tier = tierName || 'Individual Member';
    setSelectedTier(tier);
    
    // Calculate amount from tier price label
    if (tierPriceLabel) {
      const amount = parsePriceFromLabel(tierPriceLabel);
      setSelectedTierAmount(amount);
    } else {
      // Fallback: try to find the tier in the tiers list
      const foundTier = tiers.items.find((t) => t.name === tier);
      if (foundTier) {
        const amount = parsePriceFromLabel(foundTier.priceLabel);
        setSelectedTierAmount(amount);
      } else {
        // Default fallback
        setSelectedTierAmount(1050);
      }
    }
    
    setShowIndividualModal(true);
  };

  const triggerCorporateApplication = (tierName?: string, tierPriceLabel?: string) => {
    resetCorporateForm();
    const tier = tierName || 'Corporate Membership';
    setSelectedTier(tier);

    let computedAmount = 10000;
    if (tierPriceLabel) {
      computedAmount = parsePriceFromLabel(tierPriceLabel);
    } else {
      const foundTier = tiers.items.find((t) => t.name === tier);
      if (foundTier) {
        computedAmount = parsePriceFromLabel(foundTier.priceLabel);
      }
    }

    setSelectedTierAmount(computedAmount);
    setCorporateForm(createCorporateFormState({ amountPaid: computedAmount }));
    setShowCorporateModal(true);
  };

  const triggerHousingApplication = (tierName?: string, tierPriceLabel?: string) => {
    resetHousingForm();
    const tier = tierName || 'Housing Corporations';
    setSelectedTier(tier);

    let computedAmount = 5000;
    if (tierPriceLabel) {
      computedAmount = parsePriceFromLabel(tierPriceLabel);
    } else {
      const foundTier = tiers.items.find((t) => t.name === tier);
      if (foundTier) {
        computedAmount = parsePriceFromLabel(foundTier.priceLabel);
      }
    }

    setSelectedTierAmount(computedAmount);
    setShowHousingModal(true);
  };

  // --- CMS-backed content placeholders (fallbacks) ---
  // These provide data for the JSX below and prevent reference errors while CMS is being wired.
  const ICONS = {
    award: AwardIcon,
    users: UsersIcon,
    heart: HeartIcon,
    book: BookOpenIcon,
    shield: ShieldIcon,
    star: StarIcon,
  } as const;

  const defaultHero = {
    badgeLabel: 'JOIN APECK',
    title: 'Membership',
    description:
      'Join a community of passionate clergy committed to excellence in ministry and Kingdom impact',
    backgroundImage:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=75',
    primary: { label: 'Start Your Application', href: '' },
  };
  const hero = useMemo(() => {
    const raw = sectionContent['membership_hero'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          backgroundImage?: string;
          primary?: { label?: string; href?: string };
        }
      | undefined;
    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultHero.badgeLabel,
      title: raw?.title?.trim() || defaultHero.title,
      description: raw?.description?.trim() || defaultHero.description,
      backgroundImage: raw?.backgroundImage
        ? resolveMediaUrl(String(raw.backgroundImage).trim())
        : defaultHero.backgroundImage,
      primary: {
        label: raw?.primary?.label?.trim() || defaultHero.primary.label,
        href: raw?.primary?.href?.trim() || defaultHero.primary.href,
      },
    };
  }, [sectionContent]);

  const defaultBenefits = {
    badgeLabel: 'MEMBERSHIP BENEFITS',
    title: 'Membership Benefits',
    description: 'Why join APECK?',
    items: [
      {
        icon: 'award',
        title: 'Professional Development',
        description:
          'Access to comprehensive training programs, workshops, and seminars for continuous growth',
        color: '#8B2332',
      },
      {
        icon: 'users',
        title: 'Networking Opportunities',
        description:
          'Connect with fellow clergy across Kenya and build meaningful ministry partnerships',
        color: '#7A7A3F',
      },
      {
        icon: 'heart',
        title: 'Pastoral Care',
        description:
          'Receive support, counseling, and mentorship from experienced ministry leaders',
        color: '#8B2332',
      },
      {
        icon: 'shield',
        title: 'Certification',
        description:
          'Official recognition and certification as a member of APECK',
        color: '#7A7A3F',
      },
      {
        icon: 'book',
        title: 'Resource Library',
        description:
          'Access to extensive library of books, materials, and digital resources',
        color: '#8B2332',
      },
      {
        icon: 'star',
        title: 'Annual Conference',
        description:
          'Exclusive access to our annual leadership conference and special events',
        color: '#7A7A3F',
      },
    ] as Array<{ icon: keyof typeof ICONS; title: string; description: string; color: string }>,
  };

  const benefits = useMemo(() => {
    const raw = sectionContent['membership_benefits'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{ title?: string; description?: string; icon?: string; color?: string }>;
        }
      | undefined;

    const items: Array<{ icon: keyof typeof ICONS; title: string; description: string; color: string }> =
      (raw?.items ?? defaultBenefits.items).map((item) => {
        const title = (item?.title ?? '').trim();
        const description = (item?.description ?? '').trim();
        const iconKey = (item?.icon ?? '').toLowerCase().trim();
        const icon = (ICONS[iconKey as keyof typeof ICONS] ? (iconKey as keyof typeof ICONS) : ('award' as keyof typeof ICONS));
        const color = (item?.color ?? '').trim() || '#8B2332';
        return { icon, title, description, color };
      }).filter((i) => i.title && i.description);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultBenefits.badgeLabel,
      title: raw?.title?.trim() || defaultBenefits.title,
      description: raw?.description?.trim() || defaultBenefits.description,
      items: items.length ? items : defaultBenefits.items,
    };
  }, [sectionContent]);

  const defaultTiers = {
    badgeLabel: 'MEMBERSHIP CATEGORIES',
    title: 'Membership Categories',
    description: 'Choose the membership level that fits your ministry',
    items: [
      {
        name: 'Individual Member',
        priceLabel: 'KSh 1,050',
        subtitle: 'For clergy seeking personal support',
        featured: false,
        bullets: [
          'Access to core training programs & webinars',
          'Quarterly ministry insights newsletter',
          'Digital resource library & templates',
          'Access to national clergy networking forum',
        ],
        applyLabel: 'Apply Now',
      },
      {
        name: 'Corporate Membership',
        priceLabel: 'KSh 10,000',
        subtitle: 'For churches & ministry organizations',
        featured: true,
        bullets: [
          'Covers up to 5 designated clergy leaders',
          'Priority booking for onsite training & audits',
          'Custom leadership retreats & mentorship tracks',
          'Discounted exhibition & conference booths',
          'Voting rights & policy participation',
        ],
        applyLabel: 'Apply Now',
      },
      {
        name: 'Housing Corporations',
        priceLabel: 'KSh 5,050',
        subtitle: 'Strategic partners for clergy housing',
        featured: false,
        bullets: [
          'Co-branding on APECK housing initiatives',
          'Direct access to clergy housing cooperative',
          'Pipeline of pre-qualified ministry clients',
          'Invitation to investment forums & expos',
          'Dedicated partnership & compliance support',
        ],
        applyLabel: 'Apply Now',
      },
    ] as Array<{
      name: string;
      priceLabel: string;
      subtitle?: string;
      featured?: boolean;
      bullets: string[];
      applyLabel?: string;
    }>,
  };

  const tiers = useMemo(() => {
    const raw = sectionContent['membership_tiers'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{
            name?: string;
            priceLabel?: string;
            subtitle?: string;
            featured?: boolean;
            bullets?: Array<string | { text?: string }>;
            applyLabel?: string;
          }>;
        }
      | undefined;

    const items =
      (raw?.items ?? defaultTiers.items).map((t) => ({
        name: (t.name ?? '').trim(),
        priceLabel: (t.priceLabel ?? '').trim(),
        subtitle: (t.subtitle ?? '').trim(),
        featured: Boolean(t.featured),
        bullets:
          (t.bullets ?? [])
            .map((b) => (typeof b === 'string' ? b.trim() : (b.text ?? '').trim()))
            .filter(Boolean) || [],
        applyLabel: (t.applyLabel ?? 'Apply Now').trim(),
      })).filter((t) => t.name && t.priceLabel);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultTiers.badgeLabel,
      title: raw?.title?.trim() || defaultTiers.title,
      description: raw?.description?.trim() || defaultTiers.description,
      items: items.length ? items : defaultTiers.items,
    };
  }, [sectionContent]);

  const defaultRequirements = {
    badgeLabel: 'MEMBERSHIP REQUIREMENTS',
    title: 'Membership Requirements',
    description: 'What you need to become a member',
    items: [
      {
        icon: 'heart',
        title: 'Calling to Ministry',
        description: 'Clear evidence of a calling to full-time Christian ministry',
      },
      {
        icon: 'book',
        title: "Doctrinal Statement",
        description: "Agreement with APECK's statement of faith and core beliefs",
      },
      {
        icon: 'award',
        title: 'Ministry Experience',
        description:
          'Active involvement in ministry (requirements vary by membership level)',
      },
      {
        icon: 'users',
        title: 'References',
        description: 'Two pastoral references from recognized ministry leaders',
      },
      {
        icon: 'shield',
        title: 'Application Fee',
        description: 'One-time non-refundable application fee of KSh 1,000',
      },
    ] as Array<{ icon: keyof typeof ICONS; title: string; description: string }>,
  };

  const requirements = useMemo(() => {
    const raw = sectionContent['membership_requirements'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          items?: Array<{ title?: string; description?: string; icon?: string }>;
        }
      | undefined;

    const items: Array<{ icon: keyof typeof ICONS; title: string; description: string }> =
      (raw?.items ?? defaultRequirements.items).map((it) => {
        const title = (it?.title ?? '').trim();
        const description = (it?.description ?? '').trim();
        const iconKey = (it?.icon ?? '').toLowerCase().trim();
        const icon = (ICONS[iconKey as keyof typeof ICONS] ? (iconKey as keyof typeof ICONS) : ('heart' as keyof typeof ICONS));
        return { icon, title, description };
      }).filter((r) => r.title && r.description);

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultRequirements.badgeLabel,
      title: raw?.title?.trim() || defaultRequirements.title,
      description: raw?.description?.trim() || defaultRequirements.description,
      items: items.length ? items : defaultRequirements.items,
    };
  }, [sectionContent]);

  const defaultCta = {
    badgeLabel: 'GET STARTED',
    title: 'Ready to Join APECK?',
    description:
      'Take the next step in your ministry journey and become part of our community',
    primaryLabel: 'Start Your Application',
  };

  const cta = useMemo(() => {
    const raw = sectionContent['membership_cta'] as
      | {
          badgeLabel?: string;
          title?: string;
          description?: string;
          primaryLabel?: string;
          primary?: { label?: string; href?: string };
        }
      | undefined;

    const primaryLabel =
      raw?.primaryLabel?.trim() ||
      raw?.primary?.label?.trim() ||
      defaultCta.primaryLabel;

    return {
      badgeLabel: raw?.badgeLabel?.trim() || defaultCta.badgeLabel,
      title: raw?.title?.trim() || defaultCta.title,
      description: raw?.description?.trim() || defaultCta.description,
      primaryLabel,
    };
  }, [sectionContent]);
  // --- end placeholders ---

  // Fetch CMS content for membership page
  useEffect(() => {
    let mounted = true;
    fetchPageContent('membership')
      .then((page) => {
        if (!mounted) return;
        const map: Record<string, unknown> = {};
        page.sections?.forEach((s) => {
          map[s.key] = s.content;
        });
        setSectionContent(map);
      })
      .catch(() => {
        // fall back to defaults silently
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-b from-[#FBF7F2] via-[#F5F1EB] to-[#EFE7DE] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] pt-20 overflow-hidden transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.08] dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(139,35,50,0.25) 0, transparent 45%), radial-gradient(circle at 80% 0%, rgba(122,122,63,0.15) 0, transparent 40%), radial-gradient(circle at 50% 80%, rgba(139,35,50,0.12) 0, transparent 50%)',
        }}
      ></div>

      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
            willChange: 'background-image'
          }}
        ></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B2332]/85 via-[#8B2332]/80 to-[#6B1A28]/85"></div>
        
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.08} size="32px" />
        <DottedPattern opacity={0.05} size="48px" />
        <GeometricPattern opacity={0.04} />
        <GeometricPattern opacity={0.025} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#ffffff" />
        <AbstractShape position="bottom" color="#ffffff" />
        
        {/* Additional floating shapes */}
        <div className="absolute top-1/4 right-1/6 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#ffffff" opacity="0.15"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#ffffff" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/6 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.12"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.1"/>
          </svg>
        </div>
        
        {/* Blur effects */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="membership-hero"
          >
            <div className={`${isVisible['membership-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20">
                  {hero.badgeLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed mb-8">
                {hero.description}
              </p>
              <button
                onClick={() => {
                  // Find the first tier (usually Individual Member) and trigger with its details
                  const firstTier = tiers.items[0];
                  if (firstTier) {
                    triggerIndividualApplication(firstTier.name, firstTier.priceLabel);
                  } else {
                    triggerIndividualApplication();
                  }
                }}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#8B2332] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>{hero.primary.label}</span>
                <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-52 h-52 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,15 85,50 50,85 15,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-48 h-48 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 80,25 80,60 Q 80,95 50,85 Q 20,95 20,60 Q 20,25 50,0 Z"
              fill="#7A7A3F"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* More floating shapes */}
        <div className="absolute top-1/3 right-1/6 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/6 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#7A7A3F"
              strokeWidth="1.5"
              opacity="0.1"
            />
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-56 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-56 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-2 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-72 h-72 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,25 Q 140,45 155,100 Q 140,155 100,135 Q 60,155 45,100 Q 60,45 100,25 Z"
              fill="#8B2332"
              opacity="0.05"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-68 h-68 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 55,55 Q 95,20 135,55 Q 180,95 135,135 Q 95,180 55,135 Q 20,95 55,55 Z"
              fill="#7A7A3F"
              opacity="0.06"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/6 right-1/4 w-32 h-32 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/6 left-1/4 w-34 h-34 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,12 88,50 50,88 12,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        {/* Star-like decorative shapes */}
        <div className="absolute top-28 right-1/6 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,12 L52,35 L75,35 L58,48 L68,71 L50,58 L32,71 L42,48 L25,35 L48,35 Z" fill="#8B2332" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-28 left-1/6 w-16 h-16 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,15 L51.5,32 L68,32 L56,42 L63,59 L50,52 L37,59 L44,42 L32,32 L48.5,32 Z" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.1"/>
            <polygon points="50,16 76.3,32 76.3,68 50,84 23.7,68 23.7,32" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,35 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,65 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="benefits-header"
          >
            <div className={`${isVisible['benefits-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {benefits.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {benefits.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {benefits.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {benefits.items.map((benefit, idx) => {
              const Icon = ICONS[benefit.icon] ?? AwardIcon;
              const isMaroon = benefit.color === '#8B2332';
              return (
                <div 
                  key={`${benefit.title}-${idx}`}
                  className="transform transition-all duration-700"
                  data-animate-id={`benefit-${idx}`}
                >
                  <div className={`bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 dark:border-gray-700 group h-full ${
                    isVisible[`benefit-${idx}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                  }`}>
                    {/* Dotted pattern overlay */}
                    <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `linear-gradient(to bottom right, transparent, ${benefit.color === '#8B2332' ? 'rgba(139, 34, 50, 0.05)' : 'rgba(122, 122, 63, 0.05)'})`
                    }}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 bg-gradient-to-br ${isMaroon ? 'from-[#8B2332]/20 to-[#8B2332]/10 dark:from-[#B85C6D]/20 dark:to-[#B85C6D]/10 border-[#8B2332]/20 dark:border-[#B85C6D]/20' : 'from-[#7A7A3F]/20 to-[#7A7A3F]/10 dark:from-[#9B9B5F]/20 dark:to-[#9B9B5F]/10 border-[#7A7A3F]/20 dark:border-[#9B9B5F]/20'} rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                        <Icon size={36} className={isMaroon ? "text-[#8B2332] dark:text-[#B85C6D]" : "text-[#7A7A3F] dark:text-[#9B9B5F]"} strokeWidth={2.5} />
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${isMaroon ? 'text-[#8B2332] dark:text-[#B85C6D] group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E]' : 'text-[#8B2332] dark:text-[#B85C6D]'}`}>
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                    
                    {/* Decorative corners */}
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${benefit.color}33`
                    }}></div>
                    <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{
                      borderColor: `${benefit.color === '#8B2332' ? '#7A7A3F' : '#8B2332'}33`
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Membership Tiers */}
      <section className="relative py-20 md:py-32 bg-gray-50 dark:bg-gray-800 overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        <AbstractShape position="left" color="#8B2332" />
        <AbstractShape position="right" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 75,20 75,50 Q 75,80 50,75 Q 25,80 25,50 Q 25,20 50,0 Z"
              fill="#7A7A3F"
              opacity="0.12"
            />
          </svg>
        </div>
        
        {/* More floating shapes */}
        <div className="absolute top-1/3 right-1/5 w-36 h-36 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 92,50 50,92 8,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/3 left-1/5 w-32 h-32 opacity-3 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 L 100,86.6 L 50,100 L 0,86.6 Z"
              fill="none"
              stroke="#7A7A3F"
              strokeWidth="1.5"
              opacity="0.1"
            />
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-56 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-56 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#8B2332]/8 to-transparent hidden lg:block"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-36 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/8 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-10 w-2.5 h-2.5 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-20 left-12 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-28 right-10 w-2.5 h-2.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-1.5 h-1.5 bg-[#8B2332]/15 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-2 bg-[#7A7A3F]/15 rounded-full hidden lg:block"></div>
        
        {/* Organic shapes */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-72 h-72 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 100,25 Q 140,45 155,100 Q 140,155 100,135 Q 60,155 45,100 Q 60,45 100,25 Z"
              fill="#8B2332"
              opacity="0.05"
            />
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-68 h-68 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              d="M 55,55 Q 95,20 135,55 Q 180,95 135,135 Q 95,180 55,135 Q 20,95 55,55 Z"
              fill="#7A7A3F"
              opacity="0.06"
            />
          </svg>
        </div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-28 h-28 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="0,0 50,50 0,100" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-3 hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="100,100 0,100 50,50" fill="#8B2332" opacity="0.07"/>
            <polygon points="100,100 50,50 100,0" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-56 h-56 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.25"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.18"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#8B2332" strokeWidth="0.6" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-52 h-52 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="75" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.22"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.18"/>
          </svg>
        </div>
        
        {/* Additional scattered shapes */}
        <div className="absolute top-1/6 right-1/4 w-32 h-32 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 75,100 25,100 0,50" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/6 left-1/4 w-34 h-34 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,12 88,50 50,88 12,50" fill="#8B2332" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/2 right-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#8B2332]/12 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/12 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        {/* Star-like decorative shapes */}
        <div className="absolute top-28 right-1/6 w-18 h-18 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,12 L52,35 L75,35 L58,48 L68,71 L50,58 L32,71 L42,48 L25,35 L48,35 Z" fill="#8B2332" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-28 left-1/6 w-16 h-16 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,15 L51.5,32 L68,32 L56,42 L63,59 L50,52 L37,59 L44,42 L32,32 L48.5,32 Z" fill="#7A7A3F" opacity="0.08"/>
          </svg>
        </div>
        
        {/* Hexagonal patterns */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-4 hidden xl:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="none" stroke="#8B2332" strokeWidth="1.2" opacity="0.1"/>
            <polygon points="50,16 76.3,32 76.3,68 50,84 23.7,68 23.7,32" fill="#7A7A3F" opacity="0.05"/>
          </svg>
        </div>
        
        {/* Wave patterns */}
        <div className="absolute top-0 left-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,35 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="absolute bottom-0 right-1/4 w-56 h-28 opacity-3 hidden xl:block">
          <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,50 Q25,65 50,50 T100,50 T150,50 T200,50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.07"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-16 md:mb-20 transform transition-all duration-700"
            data-animate-id="tiers-header"
          >
            <div className={`${isVisible['tiers-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {tiers.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {tiers.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {tiers.description}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {tiers.items.map((tier, index) => {
              const normalizedTierName = tier.name.toLowerCase();
              const isFeatured = !!tier.featured;
              const isIndividualTier = normalizedTierName.includes('individual');
              const isCorporateTier = normalizedTierName.includes('corporate');
              const isHousingTier = normalizedTierName.includes('housing');
              const headerClasses = isFeatured
                ? 'bg-gradient-to-br from-[#8B2332] to-[#6B1A28]'
                : index % 2 === 0
                ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                : 'bg-gradient-to-br from-[#7A7A3F] to-[#6A6A35]';
              return (
                <div 
                  key={`${tier.name}-${index}`}
                  className="transform transition-all duration-700"
                  data-animate-id={`tier-${index+1}`}
                >
                  <div className={`bg-white dark:bg-gray-800 rounded-3xl ${isFeatured ? 'shadow-2xl hover:shadow-3xl border-4 border-[#8B2332] dark:border-[#B85C6D]' : 'shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700'} group transition-all duration-500 transform hover:-translate-y-2 h-full ${isVisible[`tier-${index+1}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
                    {isFeatured && (
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-[#7A7A3F] to-[#8B2332] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20">
                        POPULAR
                      </div>
                    )}
                    <div className={`${headerClasses} text-white p-8 text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{tier.name}</h3>
                        {tier.subtitle ? <p className="text-white/80 mb-4">{tier.subtitle}</p> : null}
                        <div className="text-2xl md:text-3xl font-bold mb-1">{tier.priceLabel}</div>
                      </div>
                    </div>
                    <div className="p-8">
                      {tier.bullets?.length ? (
                        <ul className="space-y-4 mb-8">
                          {tier.bullets.map((b, i) => (
                            <li key={i} className="flex items-start space-x-3">
                              <CheckIcon size={20} className={`${isFeatured ? 'text-[#8B2332] dark:text-[#B85C6D]' : 'text-[#7A7A3F] dark:text-[#9B9B5F]'} mt-0.5 flex-shrink-0`} strokeWidth={2.5} />
                              <span className="text-gray-700 dark:text-gray-300">{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <button 
                        onClick={() => {
                          if (isIndividualTier) {
                            triggerIndividualApplication(tier.name, tier.priceLabel);
                            return;
                          }
                          if (isCorporateTier) {
                            triggerCorporateApplication(tier.name, tier.priceLabel);
                            return;
                          }
                          if (isHousingTier) {
                            triggerHousingApplication(tier.name, tier.priceLabel);
                            return;
                          }
                          setSelectedTier(tier.name);
                          const amount = parsePriceFromLabel(tier.priceLabel);
                          setSelectedTierAmount(amount);
                          setIsEnrollFormOpen(true);
                        }}
                        className={`w-full px-6 py-3 ${isFeatured ? 'bg-[#8B2332] hover:bg-[#6B1A28]' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105`}
                      >
                        {isIndividualTier || isCorporateTier || isHousingTier ? 'Apply & Pay' : tier.applyLabel || 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-white dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* Requirements */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#FEFAF4] via-[#F6F0E8]/70 to-[#F1E5D9] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-44 h-44 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-40 h-40 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7A7A3F" strokeWidth="2" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-10 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-16 left-10 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 right-8 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-44 h-44 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="65" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.18"/>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        {/* Diagonal accent lines */}
        <div className="absolute top-1/3 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-[#8B2332]/10 to-transparent transform rotate-45 hidden xl:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-[#7A7A3F]/10 to-transparent transform -rotate-45 hidden xl:block"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center mb-12 md:mb-16 transform transition-all duration-700"
            data-animate-id="requirements-header"
          >
            <div className={`${isVisible['requirements-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {requirements.badgeLabel}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#8B2332] dark:text-[#B85C6D] mb-4 leading-tight">
                {requirements.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                {requirements.description}
              </p>
            </div>
          </div>
          <div 
            className="transform transition-all duration-700"
            data-animate-id="requirements-content"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 ${
              isVisible['requirements-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              {/* Dotted pattern overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-[0.02]" style={{
                backgroundImage: 'radial-gradient(circle, #8B2332 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}></div>
              
              <ul className="space-y-6 relative z-10">
                {requirements.items.map((req, index) => {
                  const Icon = ICONS[req.icon] ?? HeartIcon;
                  return (
                    <li key={`${req.title}-${index}`} className="flex items-start space-x-4 group">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#8B2332]/20 to-[#8B2332]/10 dark:from-[#B85C6D]/20 dark:to-[#B85C6D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                        <Icon size={24} className="text-[#8B2332] dark:text-[#B85C6D]" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#8B2332] dark:text-[#B85C6D] mb-2 group-hover:text-[#6B1A28] dark:group-hover:text-[#C96D7E] transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {req.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="currentColor" className="text-[#FAF9F7] dark:text-gray-800"/>
          </svg>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#F7F3EC] via-[#F2EBE1] to-[#EADFD2] dark:bg-gradient-to-b dark:from-[#0f0f10] dark:via-[#121214] dark:to-[#151517] overflow-hidden transition-colors duration-300">
        {/* Enhanced background graphics */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-44 h-44 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-40 h-40 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7A7A3F" strokeWidth="2" opacity="0.12"/>
          </svg>
        </div>
        
        {/* Blur effects for depth */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#8B2332]/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#7A7A3F]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B2332]/1.5 rounded-full blur-3xl"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-48 bg-gradient-to-b from-transparent via-[#8B2332]/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-48 bg-gradient-to-b from-transparent via-[#7A7A3F]/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute top-24 right-10 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-16 left-10 w-2 h-2 bg-[#8B2332]/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 right-8 w-1.5 h-1.5 bg-[#7A7A3F]/20 rounded-full hidden md:block"></div>
        
        {/* Circle patterns */}
        <div className="absolute top-1/4 left-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="none" stroke="#8B2332" strokeWidth="1" opacity="0.2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#7A7A3F" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 right-0 w-44 h-44 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="65" fill="none" stroke="#7A7A3F" strokeWidth="1" opacity="0.18"/>
            <circle cx="100" cy="100" r="45" fill="none" stroke="#8B2332" strokeWidth="0.8" opacity="0.15"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            className="transform transition-all duration-700"
            data-animate-id="cta-section"
          >
            <div className={`${isVisible['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#8B2332]/15 via-[#8B2332]/20 to-[#8B2332]/15 dark:from-[#B85C6D]/15 dark:via-[#B85C6D]/20 dark:to-[#B85C6D]/15 text-[#8B2332] dark:text-[#B85C6D] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-md border border-[#8B2332]/20 dark:border-[#B85C6D]/20">
                  {cta.badgeLabel}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-[#8B2332] dark:text-[#B85C6D]">
                {cta.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                {cta.description}
              </p>
              <button
                onClick={() => setIsEnrollFormOpen(true)}
                className="group/btn px-8 py-4 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-all inline-flex items-center space-x-2 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>{cta.primaryLabel}</span>
                <ArrowRightIcon size={20} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showIndividualModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 py-12 pt-32 md:pt-28 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleIndividualSubmit} className="flex flex-col max-h-[90vh]">
              <div className="sticky top-0 z-20 flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                    {selectedTier || 'Membership'} Application
                </h3>
              </div>
              <button
                onClick={closeIndividualModal}
                  type="button"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close individual member application form"
              >
                <XIcon size={18} />
              </button>
            </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* APECK Membership Application Form Header */}
              <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                  APECK Membership Application Form
                </h4>
              </div>

              {/* APPLICANT PERSONAL INFORMATION */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                  APPLICANT PERSONAL INFORMATION
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  Please complete all fields below accurately
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Full Names (As on National ID) *
                    <input
                      type="text"
                      name="fullName"
                      value={individualForm.fullName}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    National ID No. *
                    <input
                      type="text"
                      name="idNumber"
                      value={individualForm.idNumber}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Phone Number *
                    <input
                      type="tel"
                      name="phone"
                      value={individualForm.phone}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Email Address *
                    <input
                      type="email"
                      name="email"
                      value={individualForm.email}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    County of Residence (Kenya) *
                    <div className="relative" ref={countyDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountyDropdownOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      >
                        <span>{individualForm.county ? individualForm.county : 'Select County'}</span>
                        <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                      </button>
                      {isCountyDropdownOpen && (
                        <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <input
                              type="text"
                              value={countySearchTerm}
                              onChange={(e) => setCountySearchTerm(e.target.value)}
                              placeholder="Search county"
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {filteredCounties.length ? (
                              filteredCounties.map((county) => (
                                <button
                                  type="button"
                                  key={county}
                                  onClick={() => handleSelectCounty(county)}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    individualForm.county === county
                                      ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                  }`}
                                >
                                  {county}
                                </button>
                              ))
                            ) : (
                              <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No counties found</p>
                            )}
                          </div>
                          {individualForm.county && (
                            <button
                              type="button"
                              onClick={() => handleSelectCounty('')}
                              className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-top border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                            >
                              Clear selection
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Sub-County *
                    <div className="relative" ref={subCountyDropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!individualForm.county) return;
                          setIsSubCountyDropdownOpen((prev) => !prev);
                        }}
                        disabled={!individualForm.county}
                        className={`w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#8B2332] ${
                          individualForm.county
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>
                          {individualForm.subCounty
                            ? individualForm.subCounty
                            : individualForm.county
                            ? 'Select Sub-County'
                            : 'Select county first'}
                        </span>
                        <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                      </button>
                      {isSubCountyDropdownOpen && (
                        <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <input
                              type="text"
                              value={subCountySearchTerm}
                              onChange={(e) => setSubCountySearchTerm(e.target.value)}
                              placeholder="Search sub-county"
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {filteredSubCounties.length ? (
                              filteredSubCounties.map((sub) => (
                                <button
                                  type="button"
                                  key={sub}
                                  onClick={() => handleSelectSubCounty(sub)}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    individualForm.subCounty === sub
                                      ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                  }`}
                                >
                                  {sub}
                                </button>
                              ))
                            ) : (
                              <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No sub-counties found</p>
                            )}
                          </div>
                          {individualForm.subCounty && (
                            <button
                              type="button"
                              onClick={() => handleSelectSubCounty('')}
                              className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                            >
                              Clear selection
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Ward *
                    {availableWards.length ? (
                      <div className="relative" ref={wardDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsWardDropdownOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        >
                          <span>{individualForm.ward ? individualForm.ward : 'Select Ward'}</span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isWardDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={wardSearchTerm}
                                onChange={(e) => setWardSearchTerm(e.target.value)}
                                placeholder="Search ward"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredWards.length ? (
                                filteredWards.map((ward) => (
                                  <button
                                    type="button"
                                    key={ward}
                                    onClick={() => handleSelectWard(ward)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      individualForm.ward === ward
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {ward}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No wards found</p>
                              )}
                            </div>
                            {individualForm.ward && (
                              <button
                                type="button"
                                onClick={() => handleSelectWard('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        name="ward"
                        value={individualForm.ward}
                        onChange={handleIndividualInputChange}
                        required
                        placeholder={
                          individualForm.subCounty
                            ? 'Enter ward (no data available for this sub-county)'
                            : 'Select sub-county first'
                        }
                        className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332] ${
                          !individualForm.subCounty ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
                        }`}
                        disabled={!individualForm.subCounty}
                      />
                    )}
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    If in Diaspora, country of diaspora
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      >
                        <span>
                          {individualForm.diasporaCountry ? individualForm.diasporaCountry : 'Select Country'}
                        </span>
                        <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <input
                              type="text"
                              value={countrySearchTerm}
                              onChange={(e) => setCountrySearchTerm(e.target.value)}
                              placeholder="Search country"
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {filteredCountries.length ? (
                              filteredCountries.map((country) => (
                                <button
                                  type="button"
                                  key={country}
                                  onClick={() => handleSelectCountry(country)}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    individualForm.diasporaCountry === country
                                      ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                  }`}
                                >
                                  {country}
                                </button>
                              ))
                            ) : (
                              <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No countries found</p>
                            )}
                          </div>
                          {individualForm.diasporaCountry && (
                            <button
                              type="button"
                              onClick={() => handleSelectCountry('')}
                              className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                            >
                              Clear selection
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* MINISTRY/ CHURCH DETAILS */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                  MINISTRY/ CHURCH DETAILS
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300 md:col-span-2">
                    Your Church/Ministry Name (The name of the main church/ministry you are representing) *
                    <input
                      type="text"
                      name="churchName"
                      value={individualForm.churchName}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
              <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Your Title *
                    <select
                      name="title"
                      value={individualForm.title}
                      onChange={handleIndividualInputChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    >
                      <option value="">Select Title</option>
                      <option value="Bishop">Bishop</option>
                      <option value="Reverend">Reverend</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Elder">Elder</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  {individualForm.title === 'Other' && (
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      If selected other on the previous question, please specify *
                <input
                  type="text"
                        name="titleOther"
                        value={individualForm.titleOther}
                  onChange={handleIndividualInputChange}
                        required={individualForm.title === 'Other'}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                />
              </label>
                  )}
                </div>
              </div>

              {/* REFERRAL DETAILS */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                  REFERRAL DETAILS
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  If you were referred by an existing member, please provide their details below
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Full names of the referral
                    <input
                      type="text"
                      name="referralName"
                      value={individualForm.referralName}
                      onChange={handleIndividualInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Referral's APECK Number
                    <input
                      type="text"
                      name="referralApeckNumber"
                      value={individualForm.referralApeckNumber}
                      onChange={handleIndividualInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    Referral's Phone Number
                    <input
                      type="tel"
                      name="referralPhone"
                      value={individualForm.referralPhone}
                      onChange={handleIndividualInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                    />
                  </label>
                </div>
              </div>

              {/* PAYMENT AND CONFIRMATION */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                  PAYMENT AND CONFIRMATION
                </h5>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40 space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Mandatory Registration Fee: KES {selectedTierAmount > 0 ? selectedTierAmount.toLocaleString() : '5,000'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This fee covers the initial membership share and registration processing.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment Instructions (Paystack):</p>
                    <div className="bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 rounded-lg p-4 space-y-2 border border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Paystack (supports M-Pesa STK, card, bank)</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Click <strong>Pay with Paystack</strong> below.</li>
                        <li>Select your preferred payment method (M-Pesa STK push, card, bank transfer).</li>
                        <li>Complete payment. A reference will appear automatically once successful.</li>
                      </ol>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Keep the Paystack reference for your records. We receive it automatically.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Pay with Paystack</p>
                <button
                  type="button"
                  onClick={handlePaystackPayment}
                      disabled={isPaying || !individualForm.email || !individualForm.phone || !individualForm.fullName}
                      className="px-5 py-3 rounded-xl bg-[#8B2332] text-white font-semibold hover:bg-[#6B1A28] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPaying ? 'Processing Payment...' : 'Pay with Paystack'}
                </button>
                {paymentReference && (
                      <p className="text-green-600 dark:text-green-400 font-semibold mt-2 text-sm">
                        ✓ Payment verified: {paymentReference}
                      </p>
                    )}
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      <label className="space-y-2 block">
                        Paystack Reference
                        <input
                          type="text"
                          value={paymentReference ?? ''}
                          readOnly
                          placeholder="Reference will appear after successful payment"
                          className="w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3 text-gray-700 dark:text-gray-200 focus:outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* DECLARATION */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                  DECLARATION
                </h5>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    I, the undersigned, hereby apply for membership in the Peck Housing Cooperative Society and declare that the information provided above is true and correct to the best of my knowledge. I agree to abide by the Society's by-laws and any resolutions passed by its members or governing body.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Applicant's Signature (official Name will apply as signature) *
                      <input
                        type="text"
                        name="signature"
                        value={individualForm.signature}
                        onChange={handleIndividualInputChange}
                        required
                        placeholder="Enter your full name as signature"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Date *
                      <input
                        type="date"
                        name="declarationDate"
                        value={individualForm.declarationDate}
                        onChange={handleIndividualInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              </div>

              <div className="sticky bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 rounded-b-3xl space-y-3 shadow-sm">
                {paymentMessage && (
                  <div className={`w-full p-3 rounded-xl text-sm ${
                    paymentMessage.includes('successfully') || paymentMessage.includes('verified')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {paymentMessage}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeIndividualModal}
                  className="px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentReference || isSubmittingApplication}
                    className="px-6 py-3 rounded-full bg-[#7A7A3F] text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#6A6A35] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmittingApplication ? 'Sending...' : 'Submit Application'}
                </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCorporateModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 py-12 pt-32 md:pt-28 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleCorporateSubmit} className="flex flex-col max-h-[90vh]">
              <div className="sticky top-0 z-20 flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                    {selectedTier || 'Corporate Membership'} Application
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please provide the organization and officials' details below.
                  </p>
                </div>
                <button
                  onClick={closeCorporateModal}
                  type="button"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-10">
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Organization Information
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Provide the legal details of the church, organization, or ministry.
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Name of the Church/Organization/Ministry *
                      <input
                        type="text"
                        name="organizationName"
                        value={corporateForm.organizationName}
                        onChange={handleCorporateInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Registration Certificate Number *
                      <input
                        type="text"
                        name="registrationCertificateNumber"
                        value={corporateForm.registrationCertificateNumber}
                        onChange={handleCorporateInputChange}
                        required
                        placeholder="e.g., Society/Trust number"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      KRA PIN Number *
                      <input
                        type="text"
                        name="organizationKraPin"
                        value={corporateForm.organizationKraPin}
                        onChange={handleCorporateInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Location of the Headquarters *
                      <input
                        type="text"
                        name="headquartersLocation"
                        value={corporateForm.headquartersLocation}
                        onChange={handleCorporateInputChange}
                        required
                        placeholder="Street name, building, town"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Organization Email Address *
                      <input
                        type="email"
                        name="organizationEmail"
                        value={corporateForm.organizationEmail}
                        onChange={handleCorporateInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Organization Phone Number *
                      <input
                        type="tel"
                        name="organizationPhone"
                        value={corporateForm.organizationPhone}
                        onChange={handleCorporateInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mt-5">
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      County *
                      <div className="relative" ref={corporateCountyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCorporateCountyDropdownOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        >
                          <span>
                            {corporateForm.county ? corporateForm.county : 'Select County'}
                          </span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isCorporateCountyDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={corporateCountySearchTerm}
                                onChange={(e) => setCorporateCountySearchTerm(e.target.value)}
                                placeholder="Search county"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredCorporateCounties.length ? (
                                filteredCorporateCounties.map((county) => (
                                  <button
                                    type="button"
                                    key={county}
                                    onClick={() => handleSelectCorporateCounty(county)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      corporateForm.county === county
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {county}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No counties found
                                </p>
                              )}
                            </div>
                            {corporateForm.county && (
                              <button
                                type="button"
                                onClick={() => handleSelectCorporateCounty('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Sub-County *
                      <div className="relative" ref={corporateSubCountyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!corporateForm.county) return;
                            setIsCorporateSubCountyDropdownOpen((prev) => !prev);
                          }}
                          disabled={!corporateForm.county}
                          className={`w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#8B2332] ${
                            corporateForm.county
                              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <span>
                            {corporateForm.subCounty
                              ? corporateForm.subCounty
                              : corporateForm.county
                              ? 'Select Sub-County'
                              : 'Select county first'}
                          </span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isCorporateSubCountyDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={corporateSubCountySearchTerm}
                                onChange={(e) => setCorporateSubCountySearchTerm(e.target.value)}
                                placeholder="Search sub-county"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredCorporateSubCounties.length ? (
                                filteredCorporateSubCounties.map((sub) => (
                                  <button
                                    type="button"
                                    key={sub}
                                    onClick={() => handleSelectCorporateSubCounty(sub)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      corporateForm.subCounty === sub
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No sub-counties found
                                </p>
                              )}
                            </div>
                            {corporateForm.subCounty && (
                              <button
                                type="button"
                                onClick={() => handleSelectCorporateSubCounty('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Officials' Details
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Provide the three mandatory officials as per registration guidelines.
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    {[
                      { label: "Chairperson", key: 'chairperson' as const },
                      { label: "Secretary", key: 'secretary' as const },
                      { label: "Treasurer", key: 'treasurer' as const },
                    ].map((official) => (
                      <div
                        key={official.key}
                        className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {official.label}
                          </p>
                        </div>
                        <label className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          Full Names *
                          <input
                            type="text"
                            value={corporateForm[official.key].fullName}
                            onChange={(e) =>
                              handleCorporateOfficialChange(official.key, 'fullName', e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          />
                        </label>
                        <label className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          ID Number *
                          <input
                            type="text"
                            value={corporateForm[official.key].idNumber}
                            onChange={(e) =>
                              handleCorporateOfficialChange(official.key, 'idNumber', e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          />
                        </label>
                        <label className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          KRA PIN *
                          <input
                            type="text"
                            value={corporateForm[official.key].kraPin}
                            onChange={(e) =>
                              handleCorporateOfficialChange(official.key, 'kraPin', e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          />
                        </label>
                        <label className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          Phone Number *
                          <input
                            type="tel"
                            value={corporateForm[official.key].phone}
                            onChange={(e) =>
                              handleCorporateOfficialChange(official.key, 'phone', e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          />
                        </label>
                        <label className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          Email Address *
                          <input
                            type="email"
                            value={corporateForm[official.key].email}
                            onChange={(e) =>
                              handleCorporateOfficialChange(official.key, 'email', e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Registration Payment Details
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payments are completed securely through Paystack. Provide any additional
                        reference in case of M-Pesa confirmation messages.
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="rounded-xl border border-dashed border-[#8B2332]/40 bg-[#FDF3F4] dark:bg-[#2a1619]/60 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#8B2332] dark:text-[#F5C3CB]">
                          Paystack Payment
                        </p>
                        <span className="text-xs font-semibold text-white bg-[#8B2332] rounded-full px-3 py-1">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-[#6B1A28] dark:text-[#FBE3E7]">
                        Initiate payment first, then submit the application.
                      </p>
                      <button
                        type="button"
                        onClick={handleCorporatePaystackPayment}
                        disabled={isCorporatePaying}
                        className="w-full px-4 py-3 text-sm font-semibold rounded-xl bg-[#8B2332] text-white shadow-lg hover:bg-[#6B1A28] transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isCorporatePaying ? 'Processing...' : 'Pay with Paystack'}
                      </button>
                      <label className="space-y-1 text-xs text-[#6B1A28] dark:text-[#F5C3CB] block">
                        Paystack Reference *
                        <input
                          type="text"
                          value={corporatePaymentReference ?? ''}
                          readOnly
                          placeholder="Complete payment to generate reference"
                          className="w-full rounded-lg border border-[#E6C0C5] bg-white/70 dark:bg-gray-900 px-3 py-2 focus:outline-none"
                        />
                      </label>
                    </div>
                    <div className="space-y-4">
                      <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300 block">
                        Amount Paid (Ksh) *
                        <input
                          type="number"
                          min={0}
                          step="100"
                          name="amountPaid"
                          value={corporateForm.amountPaid ? corporateForm.amountPaid.toString() : ''}
                          onChange={handleCorporateInputChange}
                          required
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        />
                      </label>
                    </div>
                  </div>
                  {corporatePaymentMessage && (
                    <div
                      className={`p-3 rounded-xl text-sm ${
                        corporatePaymentMessage.includes('successfully') ||
                        corporatePaymentMessage.includes('verified')
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {corporatePaymentMessage}
                    </div>
                  )}
                </div>
              </div>
              </div>
              <div className="sticky bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 rounded-b-3xl space-y-3 shadow-sm">
                {corporatePaymentMessage && (
                  <div
                    className={`p-3 rounded-xl text-sm ${
                      corporatePaymentMessage.includes('successfully') ||
                      corporatePaymentMessage.includes('verified')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {corporatePaymentMessage}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeCorporateModal}
                    className="px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!corporatePaymentReference || isSubmittingCorporateApplication}
                    className="px-6 py-3 rounded-full bg-[#7A7A3F] text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#6A6A35] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingCorporateApplication ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHousingModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 py-12 pt-32 md:pt-28 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleHousingSubmit} className="flex flex-col max-h-[90vh]">
              <div className="sticky top-0 z-20 flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl shadow-sm">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                    PECK HOUSING COOPERATIVE SOCIETY (PHCS)
                  </p>
                  <h3 className="text-2xl font-bold text-[#8B2332] dark:text-[#B85C6D]">
                    Membership Registration Form
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeHousingModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  aria-label="Close housing corporations application form"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section className="space-y-4">
                  <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D]">
                      APPLICANT PERSONAL INFORMATION
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                      Please complete all fields below accurately
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Full Names (As on National ID) *
                      <input
                        type="text"
                        name="fullName"
                        value={housingForm.fullName}
                        onChange={handleHousingInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      National ID No. *
                      <input
                        type="text"
                        name="idNumber"
                        value={housingForm.idNumber}
                        onChange={handleHousingInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Phone Number *
                      <input
                        type="tel"
                        name="phone"
                        value={housingForm.phone}
                        onChange={handleHousingInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Email Address *
                      <input
                        type="email"
                        name="email"
                        value={housingForm.email}
                        onChange={handleHousingInputChange}
                        required
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      County of Residence (Kenya) *
                      <div className="relative" ref={housingCountyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsHousingCountyDropdownOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        >
                          <span>{housingForm.county || 'Select County'}</span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isHousingCountyDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={housingCountySearchTerm}
                                onChange={(e) => setHousingCountySearchTerm(e.target.value)}
                                placeholder="Search county"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredHousingCounties.length ? (
                                filteredHousingCounties.map((county) => (
                                  <button
                                    type="button"
                                    key={county}
                                    onClick={() => handleSelectHousingCounty(county)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      housingForm.county === county
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {county}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No counties found
                                </p>
                              )}
                            </div>
                            {housingForm.county && (
                              <button
                                type="button"
                                onClick={() => handleSelectHousingCounty('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Sub-County *
                      <div className="relative" ref={housingSubCountyDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!housingForm.county) return;
                            setIsHousingSubCountyDropdownOpen((prev) => !prev);
                          }}
                          disabled={!housingForm.county}
                          className={`w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#8B2332] ${
                            housingForm.county
                              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <span>
                            {housingForm.subCounty
                              ? housingForm.subCounty
                              : housingForm.county
                              ? 'Select Sub-County'
                              : 'Select county first'}
                          </span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isHousingSubCountyDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={housingSubCountySearchTerm}
                                onChange={(e) => setHousingSubCountySearchTerm(e.target.value)}
                                placeholder="Search sub-county"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredHousingSubCounties.length ? (
                                filteredHousingSubCounties.map((sub) => (
                                  <button
                                    type="button"
                                    key={sub}
                                    onClick={() => handleSelectHousingSubCounty(sub)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      housingForm.subCounty === sub
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No sub-counties found
                                </p>
                              )}
                            </div>
                            {housingForm.subCounty && (
                              <button
                                type="button"
                                onClick={() => handleSelectHousingSubCounty('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      Ward *
                      {housingAvailableWards.length ? (
                        <div className="relative" ref={housingWardDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setIsHousingWardDropdownOpen((prev) => !prev)}
                            className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                          >
                            <span>{housingForm.ward || 'Select Ward'}</span>
                            <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                          </button>
                          {isHousingWardDropdownOpen && (
                            <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                <input
                                  type="text"
                                  value={housingWardSearchTerm}
                                  onChange={(e) => setHousingWardSearchTerm(e.target.value)}
                                  placeholder="Search ward"
                                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                                />
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                {filteredHousingWards.length ? (
                                  filteredHousingWards.map((ward) => (
                                    <button
                                      type="button"
                                      key={ward}
                                      onClick={() => handleSelectHousingWard(ward)}
                                      className={`w-full text-left px-4 py-2 text-sm ${
                                        housingForm.ward === ward
                                          ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                      }`}
                                    >
                                      {ward}
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    No wards found
                                  </p>
                                )}
                              </div>
                              {housingForm.ward && (
                                <button
                                  type="button"
                                  onClick={() => handleSelectHousingWard('')}
                                  className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                                >
                                  Clear selection
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          name="ward"
                          value={housingForm.ward}
                          onChange={handleHousingInputChange}
                          required
                          placeholder={
                            housingForm.subCounty
                              ? 'Enter ward (no data available for this sub-county)'
                              : 'Select sub-county first'
                          }
                          className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332] ${
                            !housingForm.subCounty ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
                          }`}
                          disabled={!housingForm.subCounty}
                        />
                      )}
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      If in Diaspora, country of diaspora
                      <div className="relative" ref={housingCountryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsHousingCountryDropdownOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        >
                          <span>
                            {housingForm.diasporaCountry || 'Select Country'}
                          </span>
                          <ChevronDownIcon size={18} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        {isHousingCountryDropdownOpen && (
                          <div className="absolute z-[120] mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                value={housingCountrySearchTerm}
                                onChange={(e) => setHousingCountrySearchTerm(e.target.value)}
                                placeholder="Search country"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                              />
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {filteredHousingCountries.length ? (
                                filteredHousingCountries.map((country) => (
                                  <button
                                    type="button"
                                    key={country}
                                    onClick={() => handleSelectHousingCountry(country)}
                                    className={`w-full text-left px-4 py-2 text-sm ${
                                      housingForm.diasporaCountry === country
                                        ? 'bg-[#FDF3F4] dark:bg-[#2a1619] text-[#8B2332] dark:text-[#F5C3CB]'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    {country}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                  No countries found
                                </p>
                              )}
                            </div>
                            {housingForm.diasporaCountry && (
                              <button
                                type="button"
                                onClick={() => handleSelectHousingCountry('')}
                                className="w-full text-center text-xs font-medium text-[#8B2332] dark:text-[#F5C3CB] py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-[#FDF3F4] dark:hover:bg-[#2a1619]"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </section>

                <section className="space-y-4">
                  <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                    REFERRAL DETAILS
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you were referred by an existing member, please provide their details below
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300 md:col-span-1">
                      Full names of the referral
                      <input
                        type="text"
                        name="referralName"
                        value={housingForm.referralName}
                        onChange={handleHousingInputChange}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300 md:col-span-1">
                      Referral's National ID Number
                      <input
                        type="text"
                        name="referralIdNumber"
                        value={housingForm.referralIdNumber}
                        onChange={handleHousingInputChange}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300 md:col-span-1">
                      Referral's Phone Number
                      <input
                        type="tel"
                        name="referralPhone"
                        value={housingForm.referralPhone}
                        onChange={handleHousingInputChange}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                      />
                    </label>
                  </div>
                </section>

                <section className="space-y-4">
                  <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                    PAYMENT AND CONFIRMATION
                  </h5>
                  <div className="rounded-2xl border border-dashed border-[#8B2332]/40 bg-[#FDF3F4] dark:bg-[#2a1619]/60 p-5 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#8B2332] dark:text-[#F5C3CB]">
                          Mandatory Registration Fee: KES {(selectedTierAmount || 5000).toLocaleString('en-KE')}
                        </p>
                        <p className="text-xs text-[#6B1A28] dark:text-[#FBE3E7]">
                          Complete the secure Paystack payment before submitting this form.
                        </p>
                      </div>
                      <span className="inline-block px-4 py-1 text-xs font-semibold text-white bg-[#8B2332] rounded-full">
                        Paystack Secure Payment
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="rounded-xl border border-[#E6C0C5] dark:border-[#4B252C] bg-white/80 dark:bg-gray-900/70 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#8B2332] dark:text-[#F5C3CB]">
                            Paystack Payment
                          </p>
                          <span className="text-xs font-semibold text-white bg-[#8B2332] rounded-full px-3 py-1">
                            Required
                          </span>
                        </div>
                        <p className="text-sm text-[#6B1A28] dark:text-[#FBE3E7]">
                          Initiate payment first, then submit the application once you have a Paystack reference.
                        </p>
                        <button
                          type="button"
                          onClick={handleHousingPaystackPayment}
                          disabled={isHousingPaying}
                          className="w-full px-4 py-3 text-sm font-semibold rounded-xl bg-[#8B2332] text-white shadow-lg hover:bg-[#6B1A28] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isHousingPaying ? 'Processing...' : 'Pay with Paystack'}
                        </button>
                        <label className="space-y-1 text-xs text-[#6B1A28] dark:text-[#F5C3CB] block">
                          Paystack Reference *
                          <input
                            type="text"
                            value={housingPaymentReference ?? ''}
                            readOnly
                            placeholder="Complete payment to generate reference"
                            className="w-full rounded-lg border border-[#E6C0C5] dark:border-[#4B252C] bg-white/70 dark:bg-gray-900 px-3 py-2 focus:outline-none"
                          />
                        </label>
                      </div>
                      <div className="space-y-3 text-sm text-[#6B1A28] dark:text-[#FBE3E7]">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Payment Notes</p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Use the same full name, phone, and email listed in this application.</li>
                          <li>Allow pop-ups in your browser so the Paystack iframe can open.</li>
                          <li>The reference appears automatically once Paystack confirms your payment.</li>
                          <li>Contact support if you are charged but do not receive a reference.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h5 className="text-lg font-semibold text-[#8B2332] dark:text-[#B85C6D] border-b border-gray-200 dark:border-gray-700 pb-2">
                    DECLARATION
                  </h5>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      I, the undersigned, hereby apply for membership in the Peck Housing Cooperative Society and declare that the information provided above is true and correct to the best of my knowledge. I agree to abide by the Society's by-laws and any resolutions passed by its members or governing body.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        Applicant's Signature (official Name will apply as signature) *
                        <input
                          type="text"
                          name="signature"
                          value={housingForm.signature}
                          onChange={handleHousingInputChange}
                          required
                          placeholder="Enter your full name as signature"
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        />
                      </label>
                      <label className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        Date *
                        <input
                          type="date"
                          name="declarationDate"
                          value={housingForm.declarationDate}
                          onChange={handleHousingInputChange}
                          required
                          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 rounded-b-3xl space-y-3 shadow-sm">
                {housingPaymentMessage && (
                  <div
                    className={`p-3 rounded-xl text-sm ${
                      housingPaymentMessage.includes('successfully') ||
                      housingPaymentMessage.includes('verified')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {housingPaymentMessage}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeHousingModal}
                    className="px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                  disabled={!housingPaymentReference || isSubmittingHousingApplication}
                    className="px-6 py-3 rounded-full bg-[#7A7A3F] text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#6A6A35] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingHousingApplication ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Form Modal */}
      <EnrollForm 
        isOpen={isEnrollFormOpen}
        onClose={() => {
          setIsEnrollFormOpen(false);
          setSelectedTier(null);
        }}
        programName={selectedTier ? `${selectedTier} - APECK Membership` : undefined}
      />
      </div>
    </div>
  );
}
