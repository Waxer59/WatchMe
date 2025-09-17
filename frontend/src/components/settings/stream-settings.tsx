'use client'

import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useAccountStore } from '@/store/account'
import { createListCollection, Field, Input, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toaster } from '../ui/toaster'
import { StreamCategory } from '@/types'

export const categories = createListCollection({
  items: [
    { label: 'Gaming', value: 'gaming' },
    { label: 'Music', value: 'music' },
    { label: 'Art', value: 'art' },
    {
      label: 'Tech',
      value: 'tech'
    },
    { label: 'Just Chatting', value: 'just_chatting' }
  ]
})

export const StreamSettings = () => {
  const defaultStreamTitle = useAccountStore(
    (state) => state.default_stream_title
  )
  const defaultStreamCategory = useAccountStore(
    (state) => state.default_stream_category
  )
  const [newDefaultStreamTitle, setNewDefaultStreamTitle] =
    useState<string>(defaultStreamTitle)
  const [newDefaultStreamCategory, setNewDefaultStreamCategory] =
    useState<StreamCategory>(defaultStreamCategory)
  const setDefaultStreamTitle = useAccountStore(
    (state) => state.setDefaultStreamTitle
  )
  const setDefaultStreamCategory = useAccountStore(
    (state) => state.setDefaultStreamCategory
  )

  const handleSaveStreamSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      const resp = await fetch(`${getPublicEnv().BACKEND_URL}/users`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          default_stream_title: newDefaultStreamTitle || undefined,
          default_stream_category: newDefaultStreamCategory || undefined
        })
      })
      setDefaultStreamTitle(newDefaultStreamTitle)
      setDefaultStreamCategory(newDefaultStreamCategory)

      if (resp.status === 200) {
        toaster.success({
          title: 'Success',
          description: 'Stream settings updated successfully'
        })
      } else {
        toaster.error({
          title: 'Error',
          description: 'Something went wrong while updating the stream settings'
        })
      }
    } catch (error) {
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while updating the stream settings'
      })
    }
  }

  useEffect(() => {
    setNewDefaultStreamTitle(defaultStreamTitle)
  }, [defaultStreamTitle])

  useEffect(() => {
    setNewDefaultStreamCategory(defaultStreamCategory)
  }, [defaultStreamCategory])

  return (
    <>
      <h3 className="text-xl font-bold">Stream</h3>
      <p className="text-gray-400">Manage your streaming preferences</p>
      <form
        className="flex flex-col gap-4 mt-6"
        onSubmit={handleSaveStreamSettings}>
        <div className="flex items-center gap-4">
          <Field.Root>
            <Field.Label>Stream title</Field.Label>
            <Input
              placeholder={defaultStreamTitle}
              value={newDefaultStreamTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewDefaultStreamTitle(e.target.value)
              }}
              className="border-gray-700"
            />
          </Field.Root>
          <Select.Root
            collection={categories}
            value={[newDefaultStreamCategory]}
            onValueChange={(details) => {
              setNewDefaultStreamCategory(details.value[0] as StreamCategory)
            }}
            size="sm"
            width="320px">
            <Select.HiddenSelect />
            <Select.Label>Select category</Select.Label>
            <Select.Control>
              <Select.Trigger className="border-gray-700 rounded-lg border flex items-center gap-2">
                <Select.ValueText placeholder="Select category" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content
                className={'bg-gray-800 rounded-lg border border-gray-700 p-2'}>
                {categories.items.map((category) => (
                  <Select.Item
                    item={category}
                    key={category.value}
                    className="cursor-pointer">
                    {category.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </div>
        <button
          className="bg-gray-700 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-600 text-base cursor-pointer transition-colors active:bg-gray-800"
          type="submit">
          Save
        </button>
      </form>
    </>
  )
}
