export function formatCurrency(value: Number){
    return value.toLocaleString("pt-BR", {
        style:"currency",
        currency:"BRL"
    })
}