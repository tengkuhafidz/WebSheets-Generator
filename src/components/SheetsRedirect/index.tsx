import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import { findSheetIdByPermalink } from '../../services/firebase'
import { RouteComponentProps } from '@reach/router'
import { generateSheetsUrlWithId } from '../../services/sheets'
import GridLoader from 'react-spinners/GridLoader'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const SheetsRedirect: React.FC<Props> = ({ permalink }) => {
  useEffect(() => {
    const executeAsyncOperations = async () => {
      const sheetId = await findSheetIdByPermalink(permalink.toLowerCase())

      if (!sheetId || typeof window === 'undefined') {
        navigate('/')
        return
      }

      window.location.href = generateSheetsUrlWithId(sheetId)
    }

    executeAsyncOperations()
  }, [permalink])

  return (
    <div className="flex h-screen">
      <div className="mx-auto mt-64">
        <GridLoader color={'#049663'} />
      </div>
    </div>
  )
}

export default SheetsRedirect
