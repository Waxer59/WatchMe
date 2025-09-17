export const categoryCodeToCategory = (code: string) => {
  switch (code) {
    case 'art':
      return 'Art'
    case 'games':
      return 'Games'
    case 'music':
      return 'Music'
    case 'tech':
      return 'Tech'
    case 'gaming':
      return 'Gaming'
    case 'just_chatting':
      return 'Just Chatting'
    default:
      return 'Just Chatting'
  }
}