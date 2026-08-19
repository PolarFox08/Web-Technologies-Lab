import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageContent from './components/PageContent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar with Dropdown Menus */}
        <Navbar />

        {/* Main Content Area handled by React Router */}
        <main className="content-container">
          <Routes>
            {/* About Us / Home */}
            <Route
              path="/"
              element={
                <PageContent
                  title="About Our University"
                  category="Overview"
                  icon="🏛️"
                  description="Christopher Olan University is a premier higher education institution dedicated to academic excellence, innovative research, and holistic student development since 1947."
                  highlights={[
                    'Ranked among the top 10 universities nationwide',
                    'Accredited with Grade A++ by NAAC / International Accreditation Boards',
                    'Over 25,000 students and 1,200 esteemed faculty members',
                    'State-of-the-art campus spanning across 150 lush green acres',
                    'Birthplace of the Leetcode Centurion'
                  ]}
                />
              }
            />

            {/* Academics Routes */}
            <Route
              path="/academics/undergraduate"
              element={
                <PageContent
                  title="Undergraduate Programs (UG)"
                  category="Academics"
                  icon="📚"
                  description="Comprehensive 3-year and 4-year Bachelor degree programs designed with industry-relevant curricula and hands-on laboratory experiences."
                  highlights={[
                    'B.Tech / B.E. in Computer Science, AI, ECE, Mechanical & Civil',
                    'B.Sc. in Data Science, Physics, Chemistry, and Mathematics',
                    'BBA and B.Com (Honours) with specialization in Fintech',
                    'Choice-Based Credit System (CBCS) and Interdisciplinary Minors'
                  ]}
                />
              }
            />
            <Route
              path="/academics/postgraduate"
              element={
                <PageContent
                  title="Postgraduate Programs (PG)"
                  category="Academics"
                  icon="🎓"
                  description="Advanced Master's programs focused on specialized technical domains, management acumen, and applied project work."
                  highlights={[
                    'M.Tech in Artificial Intelligence, VLSI Design, and Cloud Computing',
                    'MBA with dual specialization in Marketing, Finance, and HR',
                    'MCA (Master of Computer Applications) with Cloud & DevOps lab',
                    'M.Sc. in Advanced Computing and Applied Biotechnology'
                  ]}
                />
              }
            />
            <Route
              path="/academics/phd"
              element={
                <PageContent
                  title="Doctor of Philosophy (PhD)"
                  category="Academics"
                  icon="🔬"
                  description="Rigorous doctoral research programs fostering breakthrough innovations, theoretical foundations, and patent generation."
                  highlights={[
                    'Full-time and Part-time PhD options across all engineering & science disciplines',
                    'Monthly institutional fellowship & research grants for full-time scholars',
                    'Access to centralized high-performance computing (HPC) clusters',
                    'Mandatory international journal publications and conference participation'
                  ]}
                />
              }
            />

            {/* Admissions Routes */}
            <Route
              path="/admissions/eligibility"
              element={
                <PageContent
                  title="Admission Eligibility Criteria"
                  category="Admissions"
                  icon="📋"
                  description="Review the minimum academic qualifications, prerequisite courses, and entrance exam requirements for prospective applicants."
                  highlights={[
                    'Undergraduate: Minimum 60% aggregate in 10+2 with Physics, Chem & Maths',
                    'Postgraduate: Bachelor degree in relevant discipline with minimum 55% aggregate',
                    'PhD: Master degree with minimum 60% marks or equivalent CGPA',
                    'Valid national entrance exam scores (JEE / GATE / CAT / University Test)'
                  ]}
                />
              }
            />
            <Route
              path="/admissions/application-process"
              element={
                <PageContent
                  title="Application Process"
                  category="Admissions"
                  icon="📝"
                  description="Follow the simple step-by-step online application workflow to apply for admission to our university programs."
                  highlights={[
                    'Step 1: Register on the online admission portal with basic details',
                    'Step 2: Fill in academic records and select program preferences',
                    'Step 3: Upload required transcripts, certificates, and ID proof',
                    'Step 4: Pay the application fee and submit the final form online'
                  ]}
                />
              }
            />
            <Route
              path="/admissions/important-dates"
              element={
                <PageContent
                  title="Important Admission Dates (Academic Year 2026-27)"
                  category="Admissions"
                  icon="📅"
                  description="Keep track of key milestones, application deadlines, entrance examination dates, and counseling rounds."
                  highlights={[
                    'Online Application Portal Opens: March 1, 2026',
                    'Last Date for Submission of Applications: May 15, 2026',
                    'University Entrance Examination: June 5 - June 8, 2026',
                    'First Round Seat Allotment & Counseling: June 25, 2026',
                    'Commencement of Orientation & Classes: August 1, 2026'
                  ]}
                />
              }
            />

            {/* Research Routes */}
            <Route
              path="/research/areas"
              element={
                <PageContent
                  title="Thrust Research Areas"
                  category="Research"
                  icon="💡"
                  description="Our interdisciplinary research centers lead cutting-edge investigations tackling global technological and societal challenges."
                  highlights={[
                    'Artificial Intelligence, Machine Learning & Computer Vision',
                    'Renewable Energy, Smart Grids, and Electric Vehicle Technology',
                    'Cybersecurity, Blockchain, and Quantum Cryptography',
                    'Biomedical Engineering and Computational Genomics'
                  ]}
                />
              }
            />
            <Route
              path="/research/publications"
              element={
                <PageContent
                  title="Research Publications & Patents"
                  category="Research"
                  icon="📑"
                  description="Explore high-impact scientific articles, indexed peer-reviewed journal papers, books, and patents published by our researchers."
                  highlights={[
                    '500+ Scopus and Web of Science (SCI) indexed publications annually',
                    '45+ Patents granted and 120+ filed in the last 3 years',
                    'Annual research funding of ₹15+ Crores from government and industry bodies',
                    'Active collaborations with international universities in USA, Germany & Japan'
                  ]}
                />
              }
            />

            {/* Campus Life Route */}
            <Route
              path="/campus-life"
              element={
                <PageContent
                  title="Campus Life & Student Experience"
                  category="Campus Life"
                  icon="🏫"
                  description="Experience a vibrant campus atmosphere filled with cultural festivals, technical hackathons, sporting leagues, and student clubs."
                  highlights={[
                    'Over 30 student-led clubs ranging from Robotics, Music, to Drama',
                    'Modern residential hostels with high-speed Wi-Fi and 24/7 security',
                    'Olympic-standard sports complex, gymnasium, and indoor badminton courts',
                    'Central Library with over 150,000 volumes and 24/7 digital resource access'
                  ]}
                />
              }
            />

            {/* Placements Route */}
            <Route
              path="/placements"
              element={
                <PageContent
                  title="Training & Career Placements"
                  category="Placements"
                  icon="💼"
                  description="Our dedicated Corporate Resource Centre (CRC) bridges the gap between academia and industry to facilitate stellar career opportunities."
                  highlights={[
                    '95%+ consistent placement record across all graduating batches',
                    'Highest Domestic Package: ₹48 LPA | Highest International: ₹1.1 Cr',
                    'Top Recruiters: Google, Microsoft, Amazon, Infosys, TCS, Deloitte, Larsen & Toubro',
                    'Pre-placement aptitude training, mock interviews, and resume building workshops'
                  ]}
                />
              }
            />

            {/* Contact Us Route */}
            <Route
              path="/contact"
              element={
                <PageContent
                  title="Contact Us & Campus Location"
                  category="Contact Us"
                  icon="📞"
                  description="Get in touch with our admission officers, department heads, or administrative team for any inquiries."
                  highlights={[
                    'Address: Christopher Olan University Campus, Gerugambakkam, Chennai',
                    'Admission Helpdesk: +91 80 2345 6789 / Toll Free: 1800-123-4567',
                    'General Inquiries: info@harizzu.edu.in',
                    'Office Hours: Monday - Saturday: 9:00 AM to 5:00 PM'
                  ]}
                />
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 Christopher Olan University. All Rights Reserved.</p>
          <p>Web Technologies Lab — React Navigation & Dropdown System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
