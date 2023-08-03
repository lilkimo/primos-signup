import {
  useState,
  useRef,
} from 'react'
import Input from './Input'

import { useStore } from '../store'
import { api } from '../api'

export default function Form({fullname}) {
  const store = useStore()

  const name = useRef(null)
  const [error_name, set_error_name] = useState(false)
  const [rol, set_rol] = useState(null)
  const [error_rol, set_error_rol] = useState(true)
  const nick = useRef(null)
  const [warn_nick, set_warn_nick] = useState(false)
  const siga_password = useRef(null)
  const [error_password, set_error_password] = useState([false, ''])

  function handle_rol(event) {
    let value = event.target.value.slice(0, 11).toLowerCase()
    let usm_id = value.slice(0, 9)

    if (isNaN(usm_id)) return
    if (value.length > 9) {
      if (value[9] !== '-') value = usm_id + '-' + value.slice(9)
      if (value.length > 10 && isNaN(value[10]) && value[10] !== 'k') return
    }
    set_rol(value)
  }

  function capitalize(string) {
    return string
      .split(' ')
      .map(w => w[0] + w.slice(1).toLowerCase())
      .join(' ')
  }

  function register(event) {
    event.target.disabled = true
    console.log(store.form)
    api.post('/register', {...store.form, mail: store.form.mail.join('@')})
      .then( () => window.location.reload() )
      .then( r => console.log('submitted') )
  }
  
  async function get_schedule(event) {    
    if (name.current.value == null || rol == null || error_rol)
      return
    event.target.disabled = true
    
    const data = {
      login: store.form.mail[0],
      server: store.form.mail[1],
      passwd: siga_password.current.value,
    }
    const form = {
      name: name.current.value,
      rol: rol.slice(0, 9) + (rol[10] === 'k'? 0: rol[10]),
      nick: nick.current.value,
    }
    await api.post('/schedule', data)
      .then(response => {
        store.set_booked_schedule(response.schedule)
        store.update_form(form)
        store.next_phase()
      })
      .catch(error => {
        if (!error_password[0] && error.response.status == 400)
          set_error_password([true, error.body.detail])
        else {
          store.set_booked_schedule(Array(40).fill(false))
          store.update_form(form)
          store.next_phase()
        }
      })
    event.target.disabled = false
  }


  return (
    <div className="flex flex-col bg-lightblack h-full p-10 gap-5 rounded-xl shadow-md w-1/4 min-w-[455px]">
      <span className="font-bold text-2xl">
        Ingresa tus datos
      </span>
      <Input
        ref={name}
        disabled={store.phase > 0}
        label="Nombre Completo *"
        placeholder="Felipe Andrés Rojas Saavedra"
        defaultValue={capitalize(fullname)}
        onChange={event => set_error_name(event.target.value == '')}
      >
        {store.phase == 0 && error_name &&
          <div className="text-sm text-justify bg-darkred rounded-xl border-2 border-solid border-red px-4 py-2">
            No puedes dejar éste campo vacío
          </div>
        }
      </Input>
      <Input
        disabled={store.phase > 0}
        label="Rol *"
        placeholder="202073573-1"
        onChange={handle_rol}
        onBlur={() => set_error_rol(rol?.length !== 11)}
        value={rol?? ''}
      >
        {store.phase == 0 && error_rol &&
          <div className="text-sm text-justify bg-darkred rounded-xl border-2 border-solid border-red px-4 py-2">
            Rol Inválido
          </div>
        }
      </Input>
      <Input
        ref={nick}
        disabled={store.phase > 0}
        label="Apodo"
        placeholder=""
        onFocus={_ => set_warn_nick(true)}
        onBlur={_ => set_warn_nick(false)}
      >
        {store.phase == 0 && warn_nick &&
          <div className="grid gap-2 bg-darkyellow rounded-xl border-2 border-solid border-yellow px-4 py-2">
            <p className="text-sm text-justify">
              <u>Nota</u>: Elige un apodo fácilmente identificable por tus compañeros; tu primer,
              segundo, ámbos nombres o tu nombre social son una buena opción.&ensp;
              <b>Evita usar tu Gamer Tag</b> o cualquier apodo que sea difícil de relacionar contigo
              para alguien que no te conoce de primera mano.
            </p>
            <div className="grid grid-cols-[minmax(0,_1fr)_auto] text-xs">
              <span>✔️ Felipe Rojas → Pipe</span>
              <span>❌ Felipe Rojas → pyeom</span>
              <span>✔️ V. Mackenzie → Makenki</span>
              <span>❌ V. Mackenzie → 3122</span>
            </div>
          </div>
        }
      </Input>
      <Input
        ref={siga_password}
        disabled={store.phase > 0}
        label="Clave del SIGA *"
        type='password'
      >
        {store.phase == 0 &&
          <div className="text-sm text-justify bg-darkblue rounded-xl border-2 border-solid border-blue px-4 py-2">
            Tus credenciales de acceso al SIGA serán utilizadas sólo para obtener tu horario
            y <u>no serán almacenadas</u>. Este proyecto es open source; puedes revisar cómo
            serán tratados tus datos diréctamente en el código fuente.
          </div>
        }
      </Input>
      
      {store.phase == 0 && error_password[0] &&
        <div className="text-sm text-justify bg-darkred rounded-xl border-2 border-solid border-red px-4 py-2">
          {error_password[1]}
        </div>
      }
      <div className="flex gap-5">
        {store.phase > 0 &&
          <button
            className='w-full px-4 py-2 font-bold hover:underline'
            onClick={store.prev_phase}
          >
            Atrás
          </button>
        }
        <button
          className="bg-blue w-full rounded-xl px-4 py-2 font-bold disabled:cursor-not-allowed"
          onClick={store.phase > 0
            ? store.phase > 1
              ? register
              : store.next_phase
            : get_schedule
          }
        >
          {store.phase > 0
            ? store.phase > 1
              ? 'Enviar'
              : 'Siguiente'
            : 'Importar Horario'
          }
        </button>
      </div>
    </div>
  )
}