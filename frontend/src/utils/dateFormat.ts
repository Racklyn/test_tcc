/**
 * Formata uma data para o formato brasileiro "dd/mm/yyyy 00h00"
 * @param date - Data a ser formatada (string, Date ou timestamp)
 * @returns String formatada no padrão "dd/mm/yyyy 00h00"
 */
export const formatDateTime = (date: string | Date | number): string => {
    const dateObj = new Date(date)
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    const hours = dateObj.getHours().toString().padStart(2, '0')
    const minutes = dateObj.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}h${minutes}`
}
