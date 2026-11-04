(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.EDUKASS_RETURN_TRACKER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LAST_START_DAY_KEY='edukass-korrutustabel-last-start-day-v1';

  function localDay(date){
    const pad=value=>String(value).padStart(2,'0');
    return String(date.getFullYear())+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate());
  }

  // Only a deliberate start in a later local calendar day counts as a return.
  // Store the date on this device only; do not send it or an identifier to Plausible.
  function recordStart({storage,now=new Date(),track}){
    const today=localDay(now);
    let previousDay;
    try{
      previousDay=storage.getItem(LAST_START_DAY_KEY);
      if(previousDay===today)return false;
      storage.setItem(LAST_START_DAY_KEY,today);
    }catch(error){
      // A disabled/full storage must never prevent someone from playing.
      return false;
    }
    const returning=typeof previousDay==='string'
      &&/^\d{4}-\d{2}-\d{2}$/.test(previousDay)
      &&previousDay<today;
    if(returning&&typeof track==='function')track('Korrutustabel Return');
    return returning;
  }

  return {LAST_START_DAY_KEY,localDay,recordStart};
});
