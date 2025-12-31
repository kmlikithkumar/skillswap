import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const footerLinks = {
        'Company': [
            { name: 'About Us', path: '#' },
            { name: 'Careers', path: '#' },
            { name: 'Press', path: '#' },
        ],
        'Resources': [
            { name: 'Blog', path: '#' },
            { name: 'Help Center', path: '#' },
            { name: 'Contact Us', path: '#' },
        ],
        'Legal': [
            { name: 'Privacy Policy', path: '#' },
            { name: 'Terms of Service', path: '#' },
        ]
    };

    return (
        <footer className="bg-slate-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-1">
                        <h2 className="text-2xl font-bold">SkillSwap</h2>
                        <p className="text-slate-400 mt-2">Exchange skills, gain knowledge.</p>
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="font-semibold tracking-wider uppercase">{title}</h3>
                            <ul className="mt-4 space-y-2">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-slate-400 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
                    {/* Social media icons can be added here */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
