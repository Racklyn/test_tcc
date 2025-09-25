export const USER_ID = 1 // ID do usuário padrão de teste (enquanto login não estiver implementado)


export const scoreToPercent = (score: number | undefined) => {
    if (!score) return -1
    return Math.round((score)*100)
}