'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export default function Animate({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
}: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const offset = 32
  const initial = {
    opacity: 0,
    y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
    x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function AnimateStagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimateItem({
  children,
  className,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}) {
  const offset = 28
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: direction === 'up' ? offset : 0,
          x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
        },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
