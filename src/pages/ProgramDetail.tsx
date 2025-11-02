import { useEffect, useState, useRef, memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EnrollForm } from '../components/EnrollForm';
import { 
  BookOpenIcon, 
  UsersIcon, 
  GraduationCapIcon, 
  HeartIcon, 
  TrendingUpIcon, 
  AwardIcon, 
  CheckIcon, 
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  DollarSignIcon,
  TargetIcon,
  CalendarIcon
} from 'lucide-react';

// Program data with detailed information
const programData: { [key: string]: any } = {
  'theological-training': {
    id: 'theological-training',
    title: 'Theological Training',
    icon: BookOpenIcon,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=75',
    color: '#8B2332',
    description: 'Comprehensive theological education programs covering biblical studies, systematic theology, church history, and practical ministry skills.',
    duration: '6 months to 2 years',
    price: {
      certificate: { amount: 25000, currency: 'KES', period: 'One-time payment' },
      diploma: { amount: 45000, currency: 'KES', period: 'One-time payment' },
      advanced: { amount: 85000, currency: 'KES', period: 'Full program' }
    },
    objectives: [
      'Develop a deep understanding of biblical theology and interpretation',
      'Master systematic theology and doctrinal foundations',
      'Gain comprehensive knowledge of church history',
      'Acquire practical ministry skills for effective service',
      'Build a solid foundation for advanced theological studies'
    ],
    content: {
      'Certificate in Theology (6 months)': [
        'Introduction to Biblical Studies',
        'Old Testament Survey',
        'New Testament Survey',
        'Introduction to Systematic Theology',
        'Christian Ethics and Morality',
        'Introduction to Church History',
        'Basic Hermeneutics',
        'Introduction to Pastoral Ministry'
      ],
      'Diploma in Ministry (1 year)': [
        'Advanced Biblical Interpretation',
        'Systematic Theology I & II',
        'Church History: Early Church to Reformation',
        'Church History: Modern Era',
        'Pastoral Counseling',
        'Church Administration',
        'Worship and Liturgy',
        'Missions and Evangelism',
        'Youth and Family Ministry',
        'Capstone Project'
      ],
      'Advanced Theological Studies (2 years)': [
        'Biblical Exegesis and Hermeneutics',
        'Advanced Systematic Theology',
        'Historical Theology',
        'Theology of Mission',
        'Pastoral Theology',
        'Ethics and Social Justice',
        'Church Leadership and Governance',
        'Advanced Homiletics',
        'Research Methods in Theology',
        'Thesis Project'
      ]
    },
    outcomes: [
      'Ability to interpret and teach Scripture accurately',
      'Strong foundation in Christian doctrine and theology',
      'Understanding of church history and tradition',
      'Practical skills for ministry leadership',
      'Capacity for continued theological learning'
    ],
    requirements: [
      'Minimum high school education',
      'Letter of recommendation from church leader',
      'Personal statement of faith',
      'Commitment to attend all sessions',
      'Basic reading and writing skills'
    ],
    certificate: 'Upon completion, students receive a recognized certificate/diploma suitable for ministry credentials',
    modules: 3
  },
  'leadership-development': {
    id: 'leadership-development',
    title: 'Leadership Development',
    icon: TrendingUpIcon,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=75',
    color: '#7A7A3F',
    description: 'Intensive leadership training programs designed to develop visionary leaders who can effectively lead churches and ministries.',
    duration: '3-6 months',
    price: {
      strategic: { amount: 35000, currency: 'KES', period: 'One-time payment' },
      growth: { amount: 40000, currency: 'KES', period: 'One-time payment' },
      mentorship: { amount: 30000, currency: 'KES', period: 'One-time payment' }
    },
    objectives: [
      'Develop strategic thinking and vision casting abilities',
      'Master church growth principles and practices',
      'Build effective leadership teams',
      'Learn conflict resolution and management',
      'Acquire coaching and mentoring skills'
    ],
    content: {
      'Strategic Leadership Training': [
        'Vision Development and Implementation',
        'Strategic Planning for Ministry',
        'Decision Making and Problem Solving',
        'Building and Leading Teams',
        'Change Management',
        'Communication and Influence',
        'Time and Priority Management',
        'Crisis Leadership'
      ],
      'Church Growth & Development': [
        'Principles of Church Growth',
        'Outreach and Community Engagement',
        'Discipleship Strategies',
        'Small Group Development',
        'Multi-generational Ministry',
        'Building Sustainable Structures',
        'Financial Stewardship',
        'Measuring and Evaluating Growth'
      ],
      'Mentorship & Coaching': [
        'Coaching Fundamentals',
        'Mentoring Relationships',
        'Developing Emerging Leaders',
        'Performance Management',
        'Giving and Receiving Feedback',
        'Creating Development Plans',
        'Spiritual Formation of Leaders',
        'Building a Leadership Pipeline'
      ]
    },
    outcomes: [
      'Enhanced leadership capabilities',
      'Ability to develop and implement vision',
      'Skills in team building and management',
      'Competence in conflict resolution',
      'Capability to mentor and develop others'
    ],
    requirements: [
      'Current or aspiring church leader',
      'Minimum 2 years ministry experience',
      'Commitment to leadership development',
      'Willingness to participate in practical exercises',
      'Reference from senior leader'
    ],
    certificate: 'Participants receive a Leadership Development Certificate upon completion',
    modules: 3
  },
  'pastoral-care': {
    id: 'pastoral-care',
    title: 'Pastoral Care & Counseling',
    icon: HeartIcon,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=75',
    color: '#8B2332',
    description: 'Professional training in pastoral care, counseling techniques, and spiritual guidance to help clergy effectively minister to their congregations.',
    duration: '3-6 months',
    price: {
      biblical: { amount: 38000, currency: 'KES', period: 'One-time payment' },
      crisis: { amount: 32000, currency: 'KES', period: 'One-time payment' },
      marriage: { amount: 36000, currency: 'KES', period: 'One-time payment' }
    },
    objectives: [
      'Develop biblical counseling skills',
      'Master crisis intervention techniques',
      'Learn marriage and family counseling',
      'Understand psychological and spiritual integration',
      'Build listening and empathy skills'
    ],
    content: {
      'Biblical Counseling Certification': [
        'Foundations of Biblical Counseling',
        'Theology of Counseling',
        'Counseling Methodologies',
        'Dealing with Sin and Repentance',
        'Hope and Healing in Scripture',
        'Spiritual Disciplines in Counseling',
        'Case Studies and Practice',
        'Ethics in Christian Counseling'
      ],
      'Crisis Intervention Training': [
        'Understanding Crisis and Trauma',
        'Immediate Response Protocols',
        'Grief and Loss Counseling',
        'Suicide Prevention',
        'Domestic Violence Intervention',
        'Addiction Crisis Management',
        'Community Resources and Referrals',
        'Self-Care for Counselors'
      ],
      'Marriage & Family Counseling': [
        'Biblical Foundation for Marriage',
        'Communication Skills',
        'Conflict Resolution in Relationships',
        'Parenting and Family Dynamics',
        'Pre-marital Counseling',
        'Restoring Broken Relationships',
        'Blended Family Challenges',
        'Creating Healthy Family Systems'
      ]
    },
    outcomes: [
      'Competence in biblical counseling',
      'Ability to handle crisis situations',
      'Skills in marriage and family counseling',
      'Understanding of psychological principles',
      'Capability to provide spiritual guidance'
    ],
    requirements: [
      'Called to pastoral ministry',
      'Heart for counseling and care',
      'Good listening skills',
      'Emotional maturity',
      'Ability to maintain confidentiality'
    ],
    certificate: 'Certification in Pastoral Care and Counseling upon program completion',
    modules: 3
  },
  'youth-ministry': {
    id: 'youth-ministry',
    title: 'Youth Ministry',
    icon: UsersIcon,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=75',
    color: '#8B2332',
    description: 'Specialized training for effective youth and young adult ministry',
    duration: '3 months',
    price: { standard: { amount: 28000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Understand youth culture and challenges',
      'Develop effective youth programs',
      'Build relationships with young people',
      'Create safe and engaging environments',
      'Equip youth for spiritual growth'
    ],
    content: {
      'Main Curriculum': [
        'Understanding Today\'s Youth Culture',
        'Biblical Foundations for Youth Ministry',
        'Program Development and Planning',
        'Small Group Leadership',
        'Discipleship Models for Youth',
        'Handling Difficult Situations',
        'Parent Engagement',
        'Building Youth Leadership'
      ]
    },
    outcomes: [
      'Ability to connect with youth',
      'Skills in program development',
      'Competence in discipleship',
      'Understanding of youth culture',
      'Capacity to build youth teams'
    ],
    requirements: [
      'Heart for youth ministry',
      'Ability to relate to young people',
      'Background check clearance',
      'Commitment to youth work',
      'Basic teaching skills'
    ],
    certificate: 'Youth Ministry Certificate upon completion',
    modules: 1
  },
  'childrens-ministry': {
    id: 'childrens-ministry',
    title: 'Children\'s Ministry',
    icon: GraduationCapIcon,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=75',
    color: '#7A7A3F',
    description: 'Training for impactful children\'s ministry and Sunday school programs',
    duration: '2 months',
    price: { standard: { amount: 22000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Develop age-appropriate teaching methods',
      'Create engaging children\'s programs',
      'Understand child development',
      'Build safe ministry environments',
      'Equip children with biblical foundations'
    ],
    content: {
      'Main Curriculum': [
        'Child Development and Psychology',
        'Biblical Storytelling for Children',
        'Creative Teaching Methods',
        'Classroom Management',
        'Sunday School Curriculum Development',
        'Safety and Security in Children\'s Ministry',
        'Parent Communication',
        'Volunteer Recruitment and Training'
      ]
    },
    outcomes: [
      'Skills in teaching children',
      'Ability to create engaging programs',
      'Understanding of child development',
      'Competence in safety protocols',
      'Capacity to train volunteers'
    ],
    requirements: [
      'Love for children',
      'Patience and creativity',
      'Background check clearance',
      'Ability to work with volunteers',
      'Basic teaching experience preferred'
    ],
    certificate: 'Children\'s Ministry Certificate upon completion',
    modules: 1
  },
  'worship-music': {
    id: 'worship-music',
    title: 'Worship & Music',
    icon: BookOpenIcon,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=75',
    color: '#8B2332',
    description: 'Comprehensive worship leading and church music ministry training',
    duration: '4 months',
    price: { standard: { amount: 42000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Develop worship leading skills',
      'Master music theory and practice',
      'Understand theology of worship',
      'Build worship teams',
      'Create meaningful worship experiences'
    ],
    content: {
      'Main Curriculum': [
        'Theology of Worship',
        'Worship Leading Techniques',
        'Music Theory and Harmony',
        'Sound Systems and Technology',
        'Building and Leading Worship Teams',
        'Song Selection and Arrangement',
        'Creating Atmosphere for Worship',
        'Worship in Different Contexts',
        'Improvisation and Spontaneous Worship',
        'Recording and Production Basics'
      ]
    },
    outcomes: [
      'Competence in leading worship',
      'Understanding of worship theology',
      'Skills in team building',
      'Knowledge of sound technology',
      'Ability to create worship experiences'
    ],
    requirements: [
      'Musical ability (vocal or instrumental)',
      'Heart for worship ministry',
      'Commitment to spiritual growth',
      'Ability to work in teams',
      'Basic music knowledge preferred'
    ],
    certificate: 'Worship & Music Ministry Certificate upon completion',
    modules: 1
  },
  'missions-evangelism': {
    id: 'missions-evangelism',
    title: 'Missions & Evangelism',
    icon: HeartIcon,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=75',
    color: '#7A7A3F',
    description: 'Equipping clergy for effective evangelism and missions work',
    duration: '3 months',
    price: { standard: { amount: 30000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Develop evangelism skills',
      'Understand cross-cultural ministry',
      'Learn missions strategies',
      'Build evangelism teams',
      'Create outreach programs'
    ],
    content: {
      'Main Curriculum': [
        'Biblical Foundation of Missions',
        'Personal Evangelism',
        'Cross-Cultural Ministry',
        'Church Planting Principles',
        'Outreach Program Development',
        'Discipleship in Mission Context',
        'Partnerships and Networking',
        'Fundraising for Missions',
        'Short-term Mission Trips',
        'Long-term Mission Planning'
      ]
    },
    outcomes: [
      'Competence in evangelism',
      'Understanding of missions',
      'Skills in outreach',
      'Cross-cultural awareness',
      'Ability to plant churches'
    ],
    requirements: [
      'Heart for evangelism',
      'Willingness to share faith',
      'Commitment to missions',
      'Cross-cultural sensitivity',
      'Ability to travel'
    ],
    certificate: 'Missions & Evangelism Certificate upon completion',
    modules: 1
  },
  'church-administration': {
    id: 'church-administration',
    title: 'Church Administration',
    icon: AwardIcon,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=75',
    color: '#8B2332',
    description: 'Practical training in church management and administration',
    duration: '2 months',
    price: { standard: { amount: 26000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Master church management principles',
      'Develop financial management skills',
      'Learn legal and compliance requirements',
      'Build effective administrative systems',
      'Create organizational structures'
    ],
    content: {
      'Main Curriculum': [
        'Church Governance and Structure',
        'Financial Management and Budgeting',
        'Legal Compliance and Regulations',
        'Human Resources in Church',
        'Facilities Management',
        'Technology and Systems',
        'Record Keeping and Documentation',
        'Risk Management and Insurance',
        'Strategic Planning',
        'Volunteer Management'
      ]
    },
    outcomes: [
      'Competence in church administration',
      'Financial management skills',
      'Understanding of legal requirements',
      'Ability to manage systems',
      'Capacity for strategic planning'
    ],
    requirements: [
      'Administrative role in church',
      'Interest in management',
      'Basic organizational skills',
      'Computer literacy',
      'Attention to detail'
    ],
    certificate: 'Church Administration Certificate upon completion',
    modules: 1
  },
  'media-communications': {
    id: 'media-communications',
    title: 'Media & Communications',
    icon: TrendingUpIcon,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=75',
    color: '#7A7A3F',
    description: 'Modern ministry tools for digital age evangelism and communication',
    duration: '3 months',
    price: { standard: { amount: 35000, currency: 'KES', period: 'One-time payment' } },
    objectives: [
      'Master digital communication tools',
      'Develop social media strategies',
      'Learn content creation',
      'Build online ministry presence',
      'Understand digital evangelism'
    ],
    content: {
      'Main Curriculum': [
        'Digital Ministry Strategy',
        'Social Media Management',
        'Content Creation and Marketing',
        'Website Development and Management',
        'Video Production and Editing',
        'Podcasting and Audio',
        'Email Marketing',
        'Online Community Building',
        'Analytics and Measurement',
        'Digital Evangelism Tools'
      ]
    },
    outcomes: [
      'Competence in digital tools',
      'Skills in content creation',
      'Understanding of social media',
      'Ability to build online presence',
      'Capacity for digital ministry'
    ],
    requirements: [
      'Interest in technology',
      'Basic computer skills',
      'Social media familiarity',
      'Creative ability',
      'Commitment to learning new tools'
    ],
    certificate: 'Media & Communications Certificate upon completion',
    modules: 1
  }
};

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const program = programData[programId || ''];

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
  }, [program]);

  if (!program) {
    return (
      <div className="w-full bg-white pt-20">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#8B2332] mb-4">Program Not Found</h1>
            <p className="text-gray-600 mb-8">The program you're looking for doesn't exist.</p>
            <Link to="/programs" className="px-6 py-3 bg-[#8B2332] text-white rounded-full font-semibold hover:bg-[#6B1A28] transition-colors inline-flex items-center space-x-2">
              <ArrowLeftIcon size={18} />
              <span>Back to Programs</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = program.icon;
  const programColor = program.color;

  return (
    <div className="w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${program.image})`,
            willChange: 'background-image'
          }}
        ></div>
        
        {/* Dark overlay */}
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
        
        {/* Decorative lines */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
        <div className="absolute top-1/2 right-0 w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
        
        {/* Floating decorative dots */}
        <div className="absolute top-20 left-12 w-3 h-3 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute top-28 right-16 w-2 h-2 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-24 left-16 w-2.5 h-2.5 bg-white/20 rounded-full hidden md:block"></div>
        <div className="absolute bottom-32 right-12 w-3 h-3 bg-white/20 rounded-full hidden md:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/programs" 
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-8 transition-colors"
            data-animate-id="back-link"
          >
            <ArrowLeftIcon size={18} />
            <span>Back to Programs</span>
          </Link>
          
          <div 
            className="transform transition-all duration-700"
            data-animate-id="hero-content"
          >
            <div className={`${isVisible['hero-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block mb-6">
                <span 
                  className="inline-block px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg border border-white/20"
                  style={{ backgroundColor: `${programColor}40` }}
                >
                  {program.duration.toUpperCase()} PROGRAM
                </span>
              </div>
              
              <div className="flex items-start space-x-6 mb-6">
                <div 
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/30"
                  style={{ backgroundColor: `${programColor}40` }}
                >
                  <Icon size={40} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
                    {program.title}
                  </h1>
                  <p className="text-sm md:text-base text-white/95 max-w-3xl leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,0 Q400,60 600,50 T1200,60 L1200,100 L0,100 Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Program Details */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        {/* Enhanced background graphics - multiple layers */}
        <DottedPattern opacity={0.03} size="32px" />
        <DottedPattern opacity={0.02} size="48px" className="mix-blend-multiply" />
        <GeometricPattern opacity={0.02} />
        <GeometricPattern opacity={0.015} className="rotate-45" />
        
        {/* Abstract shapes */}
        <AbstractShape position="top" color="#8B2332" />
        <AbstractShape position="bottom" color="#7A7A3F" />
        
        {/* Additional decorative geometric shapes */}
        <div className="absolute top-1/4 right-1/5 w-48 h-48 opacity-4 hidden lg:block animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,0 100,50 50,100 0,50" fill="#8B2332" opacity="0.12"/>
            <polygon points="50,18 82,50 50,82 18,50" fill="#7A7A3F" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 w-44 h-44 opacity-4 hidden lg:block animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,0 Q 75,20 75,50 Q 75,80 50,75 Q 25,80 25,50 Q 25,20 50,0 Z"
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
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Objectives */}
              <div 
                className="transform transition-all duration-700"
                data-animate-id="objectives"
              >
                <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 ${
                  isVisible['objectives'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${programColor}15` }}
                    >
                      <TargetIcon size={28} style={{ color: programColor }} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: programColor }}>
                      Program Objectives
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {program.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckIcon size={22} className="text-[#7A7A3F] mt-1 flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-gray-700 text-lg leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Program Content */}
              <div 
                className="transform transition-all duration-700"
                data-animate-id="content"
              >
                <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 ${
                  isVisible['content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${programColor}15` }}
                    >
                      <BookOpenIcon size={28} style={{ color: programColor }} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: programColor }}>
                      Program Content
                    </h2>
                  </div>
                  <div className="space-y-8">
                    {Object.entries(program.content).map(([moduleTitle, topics]: [string, any]) => (
                      <div key={moduleTitle} className="border-l-4 pl-6" style={{ borderColor: programColor }}>
                        <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: programColor }}>
                          {moduleTitle}
                        </h3>
                        <ul className="space-y-3">
                          {topics.map((topic: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: programColor }}></div>
                              <span className="text-gray-700 leading-relaxed">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div 
                className="transform transition-all duration-700"
                data-animate-id="outcomes"
              >
                <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 ${
                  isVisible['outcomes'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${programColor}15` }}
                    >
                      <AwardIcon size={28} style={{ color: programColor }} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: programColor }}>
                      Learning Outcomes
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {program.outcomes.map((outcome: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${programColor}20` }}>
                          <span className="text-sm font-bold" style={{ color: programColor }}>{index + 1}</span>
                        </div>
                        <span className="text-gray-700 text-lg leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Enroll Button */}
                <button
                  onClick={() => setIsEnrollFormOpen(true)}
                  className={`block w-full py-4 px-6 rounded-full font-semibold text-white text-center text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 ${
                    isVisible['enroll-btn'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ backgroundColor: programColor }}
                  data-animate-id="enroll-btn"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <span className="inline-flex items-center space-x-2">
                    <span>Enroll Now</span>
                    <ArrowRightIcon size={20} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Pricing Card */}
                <div 
                  className="transform transition-all duration-700"
                  data-animate-id="pricing"
                >
                  <div className={`bg-gradient-to-br rounded-3xl shadow-2xl border-2 p-8 ${
                    isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${programColor}15, ${programColor}08)`,
                    borderColor: `${programColor}30`
                  }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <DollarSignIcon size={24} style={{ color: programColor }} strokeWidth={2.5} />
                      <h3 className="text-2xl font-bold" style={{ color: programColor }}>
                        Program Fees
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {Object.entries(program.price).map(([key, price]: [string, any]) => (
                        <div key={key} className="pb-6 border-b last:border-b-0 last:pb-0" style={{ borderColor: `${programColor}20` }}>
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold" style={{ color: programColor }}>
                              {price.currency} {price.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{price.period}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div 
                  className="transform transition-all duration-700"
                  data-animate-id="quick-info"
                >
                  <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 ${
                    isVisible['quick-info'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}>
                    <h3 className="text-xl font-bold mb-6" style={{ color: programColor }}>
                      Program Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <ClockIcon size={20} className="text-[#7A7A3F] mt-1 flex-shrink-0" strokeWidth={2.5} />
                        <div>
                          <p className="font-semibold text-gray-900">Duration</p>
                          <p className="text-gray-600">{program.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CalendarIcon size={20} className="text-[#7A7A3F] mt-1 flex-shrink-0" strokeWidth={2.5} />
                        <div>
                          <p className="font-semibold text-gray-900">Modules</p>
                          <p className="text-gray-600">{program.modules} module{program.modules > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AwardIcon size={20} className="text-[#7A7A3F] mt-1 flex-shrink-0" strokeWidth={2.5} />
                        <div>
                          <p className="font-semibold text-gray-900">Certificate</p>
                          <p className="text-gray-600 text-sm">{program.certificate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div 
                  className="transform transition-all duration-700"
                  data-animate-id="requirements"
                >
                  <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 ${
                    isVisible['requirements'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}>
                    <h3 className="text-xl font-bold mb-6" style={{ color: programColor }}>
                      Requirements
                    </h3>
                    <ul className="space-y-3">
                      {program.requirements.map((requirement: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckIcon size={18} className="text-[#7A7A3F] mt-1 flex-shrink-0" strokeWidth={2.5} />
                          <span className="text-gray-700 text-sm leading-relaxed">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form Modal */}
      <EnrollForm 
        isOpen={isEnrollFormOpen}
        onClose={() => setIsEnrollFormOpen(false)}
        programName={program?.title}
        programId={programId}
      />
    </div>
  );
}

