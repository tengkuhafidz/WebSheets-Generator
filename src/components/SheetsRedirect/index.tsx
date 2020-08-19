import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import { findSheetIdByPermalink } from '../../services/firebase'
import { RouteComponentProps } from '@reach/router'
import { generateSheetsUrlWithId } from '../../services/sheets'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const SheetsRedirect: React.FC<Props> = ({ permalink }) => {
  useEffect(() => {
    const executeAsyncOperations = async () => {
      const sheetId = await findSheetIdByPermalink(permalink.toLowerCase())

      if (!sheetId || window !== undefined) {
        navigate('/')
        return
      }

      window.location.href = generateSheetsUrlWithId(sheetId)
    }

    executeAsyncOperations()
  }, [permalink])

  return <h1>Loading...</h1>
}

export default SheetsRedirect
