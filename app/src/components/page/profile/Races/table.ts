import { TableColumnsFrom } from '@/components/base/Table/Table'
import { Race, Score } from '@prisma/client'

export type RacesTableData = Pick<Score, 'accuracy' | 'netWPM'> &
	Pick<Race, 'category' | 'numWords' | 'startTime'> & {
		placement: number
	}

export const racesTableColumns: TableColumnsFrom<RacesTableData> = {
	startTime: {
		displayName: 'Time',
		width: 'minmax(max-content, 1fr)'
	},
	netWPM: {
		displayName: 'WPM',
		width: 'minmax(max-content, 1fr)'
	},
	accuracy: {
		displayName: 'Accuracy',
		width: 'minmax(max-content, 1fr)'
	},
	placement: {
		displayName: 'Placement',
		width: 'minmax(max-content, 1fr)'
	},
	category: {
		displayName: 'Category',
		width: 'minmax(max-content, 1fr)'
	},
	numWords: {
		displayName: 'Number of words',
		width: 'minmax(max-content, 1fr)'
	}
}
