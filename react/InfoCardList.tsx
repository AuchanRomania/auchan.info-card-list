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

  const imageListContent = infoCards.map(
    ({ ...props }, idx) => (
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
