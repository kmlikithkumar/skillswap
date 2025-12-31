import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const HERO_IMAGE = import.meta?.env?.VITE_HERO_IMAGE || '/images/skillswap-hero.svg';
const SHOW_OVERLAY = (import.meta?.env?.VITE_HERO_OVERLAY ?? '1') !== '0';

const HeroSection = () => (
    <section
        className="relative overflow-hidden bg-center bg-cover"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
    >
        {SHOW_OVERLAY && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent"></div>
        )}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
                Unlock Your Potential.
                <span className="block mt-2 bg-gradient-to-r from-indigo-100 via-white to-emerald-200 text-transparent bg-clip-text drop-shadow">
                    Swap Your Skills.
                </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">
                Join a community of learners and mentors. Exchange your expertise in graphic design for lessons in coding, or trade your writing skills for marketing knowledge—for free.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
                <Link to="/signup">
                    <Button size="lg" variant="primary" className="transform-none !hover:bg-primary !hover:scale-100">Get Started</Button>
                </Link>
                <Link to="/skills">
                    <Button size="lg" variant="secondary" className="transform-none !hover:bg-secondary !hover:scale-100">Explore Skills</Button>
                </Link>
            </div>
        </div>
    </section>
);

const HowItWorksSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
                <p className="mt-4 text-lg text-gray-600">A simple, effective way to learn and share.</p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center stagger-children">
                <div className="p-8 bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mx-auto">
                        <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Create Your Profile</h3>
                    <p className="mt-2 text-base text-gray-500">Sign up and list the skills you can teach and the skills you want to learn.</p>
                </div>
                <div className="p-8 bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mx-auto">
                        <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Find Your Match</h3>
                    <p className="mt-2 text-base text-gray-500">Browse and connect with users who have the skills you're looking for.</p>
                </div>
                <div className="p-8 bg-white rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mx-auto">
                        <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Start Swapping</h3>
                    <p className="mt-2 text-base text-gray-500">Chat, schedule sessions, and start your peer-to-peer learning journey.</p>
                </div>
            </div>
        </div>
    </section>
);

const TestimonialsSection = () => (
    <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">What Our Users Say</h2>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-8 stagger-children">
                <blockquote className="p-6 bg-white rounded-lg border border-slate-200">
                    <p className="text-gray-600">"SkillSwap is revolutionary. I learned Python from a data scientist in exchange for teaching him creative writing. It's an incredible way to grow without spending a dime."</p>
                    <footer className="mt-4 flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://picsum.photos/seed/jane/100/100" alt="Jane Doe" />
                        <div className="ml-4">
                            <div className="text-base font-medium text-gray-900">Jane Doe</div>
                            <div className="text-base text-gray-500">Writer & Python Novice</div>
                        </div>
                    </footer>
                </blockquote>
                <blockquote className="p-6 bg-white rounded-lg border border-slate-200">
                    <p className="text-gray-600">"As a designer, I wanted to understand backend development. I found a great partner who helped me with Node.js, and I helped him with his portfolio design. Win-win!"</p>
                    <footer className="mt-4 flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://picsum.photos/seed/john/100/100" alt="John Smith" />
                        <div className="ml-4">
                            <div className="text-base font-medium text-gray-900">John Smith</div>
                            <div className="text-base text-gray-500">UI/UX Designer</div>
                        </div>
                    </footer>
                </blockquote>
            </div>
        </div>
    </section>
);

const LandingPage = () => {
    return (
        <>
            <HeroSection />
            <HowItWorksSection />
            <TestimonialsSection />
        </>
    );
};

export default LandingPage;
