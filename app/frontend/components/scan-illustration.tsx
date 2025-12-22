'use client'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { TextScramble } from '@/components/ui/text-scramble'
import { cn } from '@/lib/utils'
import { LightDarkParticles } from "@/components/particles"

export const ScanIllustration = () => {
    const [show, setShow] = useState(false)
    const [showName, setShowName] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true)

            const hideTimer = setTimeout(() => {
                setShow(false)
                setShowName(true)
            }, 100)

            return () => clearTimeout(hideTimer)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])
    return (
        <>
            <div
                aria-hidden
                className="group relative mx-auto size-fit">
                <div className="absolute inset-0 animate-spin opacity-50 blur-lg duration-[3s]">
                    <div className="bg-linear-to-r/increasing animate-hue-rotate absolute inset-0 rounded-full from-pink-300 to-indigo-300"></div>
                </div>
                <div className="animate-scan absolute inset-0 z-10">
                    <div className="absolute inset-x-0 m-auto h-6 bg-white blur-2xl"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5, type: 'spring' }}
                    className="aspect-2/3 absolute inset-0 z-10 m-auto w-24">
                    <CardDecorator className="scale-125 border-white blur-[3px]" />
                    <motion.div
                        initial={{ '--frame-color': 'white' }}
                        animate={{ '--frame-color': 'var(--color-lime-400)' }}
                        transition={{ duration: 0.4, delay: 3.5, type: 'spring' }}>
                        <CardDecorator className="border-(--frame-color) z-10" />
                    </motion.div>
                    <LightDarkParticles id="light-dark-particles" />
                </motion.div>

                {show && <div className="absolute inset-0 z-10 scale-150 rounded-full bg-white mix-blend-overlay blur-xl" />}

                <div className="bg-radial aspect-square max-w-xs [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] group-hover:opacity-95">
                    <img
                        src="https://images.unsplash.com/photo-1603988089669-c041ac2fe196?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        className="size-full object-cover mix-blend-color"
                    />
                </div>
            </div>
            <div
                aria-hidden
                className="relative z-10 mx-auto -mt-16 flex h-4 justify-center">
                {showName && <TextScramble className="text-center font-mono text-sm uppercase text-white">Anna Johnson</TextScramble>}
            </div>
        </>
    )
}

export const CardDecorator = ({ className }: { className?: string }) => (
    <>
        <span className={cn('absolute -left-px -top-px block size-2.5 border-l-[1.5px] border-t-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -right-px -top-px block size-2.5 border-r-[1.5px] border-t-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -bottom-px -left-px block size-2.5 border-b-[1.5px] border-l-[1.5px] border-white', className)}></span>
        <span className={cn('absolute -bottom-px -right-px block size-2.5 border-b-[1.5px] border-r-[1.5px] border-white', className)}></span>
    </>
)