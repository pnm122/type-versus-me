import { RoomSettings } from '$shared/types/Room'
import { TableColumnsFrom, TableData } from '@/components/base/Table/Table'

export interface RacesTableData extends TableData {
	time: Date
	netWPM: number
	accuracy: number
	placement: number
	category: RoomSettings['category']
	numWords: number
}

export const racesTableColumns: TableColumnsFrom<RacesTableData> = {
	time: {
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
