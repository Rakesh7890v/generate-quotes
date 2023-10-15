const apiRequest = async (url = '', optionsObj=null)=>{
   await fetch(url,optionsObj)
}

export default apiRequest