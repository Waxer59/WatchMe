interface Props {
  children: React.ReactNode
}

export const VideosLayout: React.FC<Props> = ({ children }) => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
      {children}
    </ul>
  )
}
