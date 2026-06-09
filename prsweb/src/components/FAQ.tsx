import React, { useState, useRef, useEffect } from 'react'
import { FaPlus, FaMinus } from "react-icons/fa";
import gsap from "gsap";

const faqs = [
  {
    question: "พี่รหัสคืออะไร?",
    answer: "พี่รหัสคือรุ่นพี่ที่ได้รับมอบหมายให้ดูแลน้องใหม่ในคณะ โดยมีระบบหมายเลขรหัสเพื่อจับคู่พี่น้อง"
  },
  {
    question: "ฉันจะติดต่อพี่รหัสได้อย่างไร?",
    answer: "สามารถติดต่อผ่าน Line หรือ Facebook ได้เลย โดยค้นหาจากหมายเลขรหัสของคุณในหน้า 'Find Your พี่รหัส'"
  },
  {
    question: "กิจกรรมรับน้องมีอะไรบ้าง?",
    answer: "มีกิจกรรมต้อนรับน้องใหม่ ทัศนศึกษา ค่ายรับน้อง และงานเลี้ยงต้อนรับ ติดตามตารางได้ในหน้า Events"
  },
  {
    question: "ต้องเตรียมอะไรบ้างสำหรับวันแรก?",
    answer: "เตรียมบัตรนักศึกษา เอกสารลงทะเบียน และชุดนักศึกษาให้พร้อม พร้อมทั้งมาถึงก่อนเวลาอย่างน้อย 15 นาที"
  },
  {
    question: "ค่ายรับน้องจัดที่ไหน?",
    answer: "ค่ายรับน้องจัดที่ค่ายภูผาแดง จังหวัดเชียงใหม่ ระหว่างวันที่ 1-3 สิงหาคม รายละเอียดเพิ่มเติมดูได้ในหน้า Events"
  },
  {
    question: "มีค่าใช้จ่ายในการเข้าร่วมกิจกรรมไหม?",
    answer: "กิจกรรมส่วนใหญ่ไม่มีค่าใช้จ่าย แต่บางกิจกรรมอาจมีค่าอาหารและที่พัก ติดตามรายละเอียดได้ในแต่ละ Event"
  },
  {
    question: "ถ้าไม่สะดวกเข้าร่วมกิจกรรมต้องทำอย่างไร?",
    answer: "แจ้งพี่รหัสหรือทีมงานล่วงหน้าอย่างน้อย 24 ชั่วโมง เพื่อให้สามารถจัดการและปรับแผนได้ทันเวลา"
  },
]

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof faqs[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const answerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = answerRef.current
    const inner = innerRef.current
    if (!el || !inner) return

    if (isOpen) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: inner.offsetHeight, opacity: 1, duration: 0.4, ease: "power3.out",
          onComplete: () => { el.style.height = "auto" }
        }
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
    }
  }, [isOpen])

  return (
    <div className="faq-item" style={{ paddingTop: '0.5rem' }}>
      <button onClick={onToggle} className="w-full flex justify-between items-center py-4 text-left group">
        <span className="text-white text-2xl group-hover:opacity-70 transition-opacity duration-200">
          {faq.question}
        </span>
        <span className="text-gray-400 ml-4">
          {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
        </span>
      </button>

      <div ref={answerRef} style={{ height: 0, overflow: "hidden", opacity: 0 }} onClick={onToggle}>
        <div ref={innerRef} className="text-lg leading-relaxed" style={{ paddingTop: '0.25rem' }}>
          {faq.answer}
        </div>
      </div>

      <hr className="border-gray-800" style={{ marginTop: "0.5rem" }} />
    </div>
  )
}

function FAQ() {
  const [openIndices, setOpenIndices] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const items = containerRef.current.querySelectorAll('.faq-item')
    gsap.fromTo(items,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.1 }
    )
  }, [])

  const toggle = (i: number) => setOpenIndices(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  )

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center justify-center">
      <h1 className="text-white text-5xl font-bold tracking-widest mb-12">FAQ</h1>

      <div ref={containerRef} className="w-full max-w-2xl">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} isOpen={openIndices.includes(i)} onToggle={() => toggle(i)} />
        ))}
      </div>
    </div>
  )
}

export default FAQ