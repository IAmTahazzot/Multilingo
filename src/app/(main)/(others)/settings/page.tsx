'use client'

import { updateUserPreferences } from '@/actions/global'
import { Button } from '@/components/Button/Button'
import { Switch } from '@/components/Switch/Switch'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { userPreferences, user, setUserPreferences } = useGlobalState()
  const [userPreferencesState, setUserPreferencesState] = useState(userPreferences)
  const [shouldSave, setShouldSave] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (JSON.stringify(userPreferencesState) !== JSON.stringify(userPreferences)) {
      setShouldSave(true)
    } else {
      setShouldSave(false)
    }
  }, [shouldSave, userPreferencesState, userPreferences])

  if (!user) {
    return null
  }

  const saveUserPreferences = async () => {
    try {
      setSaving(true)
      const updatedPreference = await updateUserPreferences(user.id, userPreferencesState)
      setUserPreferences({
        ...userPreferences,
        sound: updatedPreference.sound
      })
    } catch (error) {
      toast.error('Failed to save user preferences')
    } finally {
      setSaving(false)
      setShouldSave(false)
    }
  }

  return (
    <div className='my-8'>
      <h1 className='text-neutral-700 text-3xl font-bold'>Account</h1>

      <div className='space-y-8 lg:p-10'>
        <div className='grid grid-cols-[100px_1fr]'>
          <span className='col-span-2 text-muted-foreground text-sm'>
            We can integrate additional features in the future, but for the purposes of this prototype, audio
            functionality will suffice.
          </span>
        </div>
        <div className='grid grid-cols-[100px_1fr]'>
          <label htmlFor='audio'>Audio</label>
          <div className='self-center'>
            <Switch
              htmlFor='audio'
              shouldChecked={true}
              onChange={isChecked => {
                setUserPreferencesState({ ...userPreferencesState, sound: isChecked })
              }}
            />
          </div>
        </div>
        <div className='grid grid-cols-[100px_1fr]'>
          <div className='col-start-2 self-center'>
            <Button
              theme={!shouldSave ? 'disabled' : 'secondary'}
              type='button'
              width={200}
              onClick={saveUserPreferences}
              disabled={!shouldSave}>
              {saving ? <div className='loader'></div> : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
