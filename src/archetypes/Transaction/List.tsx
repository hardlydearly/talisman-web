import { Field, MaterialLoader, Panel, PanelSection } from '@components'
import * as Icon from '@components/atoms/Icon'
import { css } from '@emotion/react'
import { useActiveAccount } from '@libs/talisman'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { motion } from 'framer-motion'
import groupBy from 'lodash/groupBy'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroller'
import { useDebounce } from 'react-use'

import { Item } from './Item'
import { useTransactions, useUrlParams } from './lib'

type Props = {
  addresses: string[]
  className?: string
}
export const List = ({ addresses = [], className }: Props) => {
  const { t } = useTranslation()

  const urlAddress = useUrlParams(['address'])[0]

  const { hasActiveAccount, address: selectedAddress } = useActiveAccount()
  const [fetchAddresses, setFetchAddresses] = useState(addresses)
  useEffect(() => {
    if (!hasActiveAccount) return setFetchAddresses(urlAddress ? [urlAddress, ...addresses] : addresses)
    setFetchAddresses([selectedAddress])
  }, [addresses, hasActiveAccount, selectedAddress, urlAddress])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchQueryDebounced, setSearchQueryDebounced] = useState('')
  useDebounce(() => setSearchQueryDebounced(searchQuery), 250, [searchQuery])

  const { loadMore, hasMore, transactions, status } = useTransactions(fetchAddresses, searchQueryDebounced)
  const hasTransactions = Object.keys(transactions).length > 0

  const sortedTransactions = useMemo(
    () => Object.values(transactions).sort((a, b) => b.id.localeCompare(a.id)),
    [transactions]
  )
  const dayGroupedTransactions = useMemo(
    () => groupBy(sortedTransactions, tx => startOfDay(parseISO(tx.timestamp)).toISOString()),
    [sortedTransactions]
  )

  return (
    <section className={`transaction-list ${className}`}>
      <header
        css={css`
          margin-bottom: 1rem;
          padding-bottom: 1rem;

          .field-search {
            max-width: 500px;
          }
        `}
      >
        <Field.Search value={searchQuery} onChange={setSearchQuery} placeholder="Filter by Chain, Address, Type..." />
      </header>

      <Panel
        css={css`
          > .inner {
            ::before,
            ::after {
              content: '';
              display: table;
            }
          }
        `}
      >
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore && status !== 'ERROR'}
          loader={
            <PanelSection
              key="loader"
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <MaterialLoader
                css={css`
                  margin: 0;
                `}
              />
              <div>{t('Searching the paraverse')}</div>
            </PanelSection>
          }
        >
          {Object.entries(dayGroupedTransactions).map(([day, transactions], index) => (
            <Fragment key={`${day}-${selectedAddress}`}>
              <motion.h3
                css={css`
                  margin: 1.4rem;
                  color: white;

                  &:not(:first-child) {
                    margin-top: 3rem;
                  }
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              >
                {format(parseISO(day), 'eee d MMMM yyyy')}
              </motion.h3>
              {transactions.map(transaction => (
                <Item
                  key={`${transaction.id}-${selectedAddress}`}
                  transaction={transaction}
                  addresses={fetchAddresses}
                  selectedAccount={selectedAddress}
                />
              ))}
            </Fragment>
          ))}

          {status === 'SUCCESS' && !hasTransactions && (
            <PanelSection
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <Icon.AlertCircle
                css={css`
                  display: block;
                  width: 1.2em;
                  height: 1.2em;
                `}
              />
              {t('No Transactions - try another account')}
            </PanelSection>
          )}

          {status === 'ERROR' && (
            <PanelSection
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <Icon.AlertCircle
                css={css`
                  display: block;
                  width: 1.2em;
                  height: 1.2em;
                `}
              />
              {t('An error occured')}
            </PanelSection>
          )}
        </InfiniteScroll>
      </Panel>

      <footer
        css={css`
          margin-top: 1rem;
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {status === 'SUCCESS' && !hasMore && hasTransactions && (
          <div
            css={[
              centered,
              css`
                color: var(--color-mid);
              `,
            ]}
          >
            {t('Search complete')}
          </div>
        )}
      </footer>
    </section>
  )
}

const centered = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  > * {
    margin: 0 0.3em;
  }
`
