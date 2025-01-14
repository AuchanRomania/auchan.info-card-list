import React, { PropsWithChildren } from 'react'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { InfoCardCustom } from 'auchan.info-card-custom'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const messages = defineMessages({
  title: {
    id: 'admin/editor.info-card-list.title',
  },
  description: {
    id: 'admin/editor.info-card-list.description',
  }
})

export type InfoCardsSchema = Array<{
  startDate?: string
  endDate?: string
  blockClass?: string
  [key: string]: any;
}>

export interface InfoCardListProps {
  infoCards: InfoCardsSchema
}

function InfoCardList({
  infoCards,
  children,
}: PropsWithChildren<InfoCardListProps>) {
  const { list } = useListContext() || []

  const CSS_HANDLES = infoCards.reduce((acc, curr) => {
    typeof curr.blockClass !== 'undefined' && acc.push(curr.blockClass)
    return acc
  }, [])

  const { handles } = useCssHandles(CSS_HANDLES)

  const isWithinDateRange = (startDate?: string, endDate?: string) => {
    const now = new Date()
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    if (start && now < start) return false // Exclude if current date is before startDate
    if (end && now > end) return false // Exclude if current date is after endDate
    return true
  }

  // Filter out infoCards not within the date range
  const filteredInfoCards = infoCards.filter(card =>
    isWithinDateRange(card.startDate, card.endDate)
  )

  const imageListContent = filteredInfoCards.map((props, idx) =>(
      <div className={handles[props.blockClass] ? handles[props.blockClass] : ''}>
        <InfoCardCustom
          key={idx}
          {...props}
        />
      </div>
    )
  )

  const newListContextValue = list.concat(imageListContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

InfoCardList.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default InfoCardList
