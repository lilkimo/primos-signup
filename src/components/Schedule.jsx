import './Schedule.css'

import { useEffect } from 'react'

import CircleOne from '../assets/circle_one'
import CircleTwo from '../assets/circle_two'
import CircleThree from '../assets/circle_three'
import Arrow from '../assets/arrow'

import { useStore } from '../store'
import { mod } from '../utils'

export default function Schedule() {
  const store = useStore()
  
  const toggleBlock = i => () => {
    const schedule = `${store.phase == 1? "bussy": "desire"}_schedule`
    if (schedule == "desire_schedule" && store.form["bussy_schedule"][i])
      return
    
    const schedule_clone = store.form[schedule].slice()
    schedule_clone[i] = !schedule_clone[i]
    store.update_form({ [schedule]: schedule_clone, })
  }
  
  useEffect(() => {
    store.update_form({ bussy_schedule: store.booked_schedule.slice(), })
    useStore.subscribe(
      state => state.phase,
      () => store.update_form({ desire_schedule: Array(store.booked_schedule.length).fill(false), }),
      { fireImmediately: true, }
    )
  }, [])

  return (
    <div className="flex flex-col bg-lightblack h-full p-10 gap-5 rounded-xl shadow-md w-1/2">
      <span className="font-bold text-2xl">
        Rellena tu horario
      </span>
      <div className="flex gap-x-4 justify-between items-center">
        <span className="flex items-center text-gray">
          <CircleOne
            size="1.5rem"
            fill="var(--gray)"
          />
          &ensp;Importa tu horario
        </span>
        <Arrow
          size="1rem"
          fill="var(--gray)"
        />
        <span className={`flex items-center ${store.phase != 1? "text-gray": ""}`}>
          <CircleTwo
            size="1.5rem"
            fill={`var(${store.phase == 1? "--blue": "--gray"})`}
          />
          &ensp;Ajusta tu disponibilidad
        </span>
        <Arrow
          size="1rem"
          fill="var(--gray)"
        />
        <span className={`flex items-center ${store.phase != 2? "text-gray": ""}`}>
          <CircleThree
            size="1.5em"
            fill={`var(${store.phase == 2? "--blue": "--gray"})`}
          />
          &ensp;Ingresa tu horario deseado
        </span>
      </div>
      <div className='grid w-full grid-flow-col grid-cols-[max-content_repeat(5,_1fr)] grid-rows-[auto_repeat(8,_1fr)] rounded-xl border-2 border-solid border-blue overflow-hidden '>
        <span />
        {[...Array(8).keys()].map(i => (
          <span key={i} className='row-divisor text-right font-bold px-4 py-2'>
            {(i = (i+1)*2) - 1}-{i}
          </span>
        ))}
        {store.form.bussy_schedule?.map((value, i) => {
          const even = mod(i, 8 * 2) < 8
          const header =
            i % 8 ? null : (
              <span className={`text-center px-4 py-2 ${even? "bg-black": ""}`}>
                <b>{['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][i / 8]}</b>
              </span>
            )
          const classes = ["w-full", "h-full"]
          const modulo = mod(i, 8)
          const schedule = value? store.form.bussy_schedule: store.form.desire_schedule
          if (!schedule[i - 1] || mod(i - 1, 8) > modulo)
            classes.push("rounded-t-xl")
          if (!schedule[i + 1] || mod(i + 1, 8) < modulo)
            classes.push('rounded-b-xl')

          let cell = (
            <span
              className={`row-divisor cursor-pointer ${even? "bg-black": ""}`}
              onClick={toggleBlock(i)}
            >
              {value
                ? <div className={[store.booked_schedule[i]? "bg-red": "bg-lightred", ...classes].join(' ')} />
                : store.form.desire_schedule[i] && <div className={["bg-green", ...classes].join(' ')} />
              }
            </span>
          )
          return [header, cell]
        })}
      </div>
    </div>
  )
}