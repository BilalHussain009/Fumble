const calcTime = (time) => {
    let displayDate = new Date(time)
    let currentTime = new Date()
    var difference = currentTime - displayDate;

    var daysDifference = Math.floor(difference/1000/60);
    if(daysDifference>=60){
        daysDifference=Math.floor(difference/1000/60/60)
        if(daysDifference>=24){
            daysDifference=Math.floor(difference/1000/60/60/24)
            return daysDifference+' days ago'
        }
        else{
            return daysDifference+' hours ago'
        }
    }
    else{
        return daysDifference+' Minutes ago'
    }
   
}
export default calcTime