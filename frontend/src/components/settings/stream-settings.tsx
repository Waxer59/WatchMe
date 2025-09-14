import { createListCollection, Field, Input, Select } from '@chakra-ui/react'

const categories = createListCollection({
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
  const handleSaveStreamSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

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
              placeholder="Making some good stuff"
              className="border-gray-700"
            />
          </Field.Root>
          <Select.Root collection={categories} size="sm" width="320px">
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
                {categories.items.map((framework) => (
                  <Select.Item
                    item={framework}
                    key={framework.value}
                    className="cursor-pointer">
                    {framework.label}
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
