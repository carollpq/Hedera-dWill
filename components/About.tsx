import {Newsreader} from "next/font/google";
import Image from "next/image";
import ScrollIndicator from "@/components/ScrollIndicator";

const newsreader = Newsreader({subsets: ['latin']});

export default function About() {
    return (
        <section id="about" className="min-h-screen w-full flex items-center justify-center text-white py-20">
            <div className="max-w-4xl px-4">
                <h2 className={`text-7xl font-[400] mb-8 text-start ${newsreader.className} `}>What is dWill<sup>H</sup>?
                </h2>
                <div className="space-y-6 text-xl leading-relaxed text-white/70 flex flex-col items-center">
                    <p>
                        dWill<sup>H</sup> is a decentralized inheritance solution that secures digital assets in case of
                        a user’s death or loss of wallet access.
                        After a set period of inactivity, it automatically transfers funds to a trusted backup wallet —
                        such as a family member’s or a secondary address.
                    </p>
                    <p>
                        Built on smart contracts, dWillH is fully autonomous, tamper-proof, and operates without any
                        centralized control — not even from the project team.
                    </p>
                    <div className="relative h-[500px] flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <div
                                className="absolute -z-10"
                                style={{
                                    width: '300px',
                                    height: '480px',
                                    transform: 'rotate(-26.465deg)',
                                    flexShrink: 0,
                                    borderRadius: '492.006px',
                                    background: 'linear-gradient(180deg, #DC00D3 31.73%, #03FAF5 100%)',
                                    filter: 'blur(175px)',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -60%) rotate(-26.465deg)'
                                }}
                            />
                            <div className="relative z-10">
                                <Image
                                    src="/hedera_token.png"
                                    alt="Hedera Token"
                                    width={350}
                                    height={350}
                                    className="relative z-20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ScrollIndicator/>
            </div>
        </section>
    );
}