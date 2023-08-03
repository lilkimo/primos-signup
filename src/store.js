import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useStore = create(subscribeWithSelector((set) => ({
  phase: 0,
  next_phase: () => set(state => ({
    phase: state.phase + 1,
  })),
  prev_phase: () => set(state => ({
    phase: state.phase - 1,
  })),

  form: {},
  update_form: new_form => set(state => ({
    form: {
      ...state.form,
      ...new_form,
    },
  })),

  set_booked_schedule: new_booked_schedule => set(_ => ({
    booked_schedule: new_booked_schedule
  }))
})))
