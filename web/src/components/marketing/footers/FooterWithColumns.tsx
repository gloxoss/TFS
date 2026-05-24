"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { t as translate } from "@/data/site-content";
import { Facebook, Instagram, Youtube } from "lucide-react";

interface FooterProps {
    lng: string;
}

export default function FooterWithColumns({ lng }: FooterProps) {
    const { t } = useTranslation(lng, "common");
    const { company } = useSiteSettings();

    return (
        <footer className="bg-black border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 flex flex-col items-start">
                        <h3 className="text-xl font-bold text-white mb-4">{company.name}</h3>
                        <p className="text-zinc-400 text-sm max-w-sm mb-6">
                            {translate(company.tagline, lng)}
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4 mt-2">
                            {company.social.instagram && (
                                <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Instagram">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {company.social.facebook && (
                                <a href={company.social.facebook} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Facebook">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {company.social.youtube && (
                                <a href={company.social.youtube} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="YouTube">
                                    <Youtube className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href={`/${lng}/equipment`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Equipment
                                </Link>
                            </li>

                            <li>
                                <Link href={`/${lng}/about`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/contact`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-zinc-400 text-sm">
                            <li>
                                <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">
                                    {company.email}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${company.phone.link}`} className="hover:text-white transition-colors">
                                    {company.phone.display}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${company.fax.link}`} className="hover:text-white transition-colors">
                                    {company.fax.display}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/DYrvH6NSsuGwpLim7?g_st=ic"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors block leading-relaxed"
                                >
                                    {company.address.street} {company.address.postalCode} - {company.address.city}, {company.address.country}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright & Credits */}
                <div className="border-t border-zinc-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-500 text-sm">
                            © {new Date().getFullYear()} TV Film Solutions. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
