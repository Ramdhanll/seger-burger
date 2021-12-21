export default () => {
   const date = new Date()
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const seconds = date.getSeconds()

   return `SB${day}${hour}${minute}${seconds}`
}
