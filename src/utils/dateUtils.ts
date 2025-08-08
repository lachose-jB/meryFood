import { Timestamp } from 'firebase/firestore'

export const convertToDate = (date: string | Timestamp): Date => {
  if (date instanceof Timestamp) {
    return date.toDate()
  }
  return new Date(date)
}

export const formatFirebaseDate = (date: string | Timestamp): string => {
  const jsDate = convertToDate(date)
  return jsDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}