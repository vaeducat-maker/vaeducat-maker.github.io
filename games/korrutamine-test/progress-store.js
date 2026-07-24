(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.EDUKASS_PROGRESS_STORE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function create({storage,key,schemaVersion=1,maxLevel=15}){
    function defaultProgress(){
      return {
        saveVersion:schemaVersion,
        unlockedLevel:1,
        completedLevels:[],
        multiplicationLessonSeen:false,
        divisionLessonSeen:false,
        lessonSeen:{},
        factStats:{}
      };
    }

    function migrate(saved){
      if(!saved||typeof saved!=='object')return null;
      let version=Number.isInteger(saved.saveVersion)?saved.saveVersion:0;
      let migrated={...saved};
      while(version<schemaVersion){
        if(version===0){
          migrated={...migrated,saveVersion:1};
          version=1;
          continue;
        }
        if(version===1){
          const lessonSeen={...(migrated.lessonSeen||{})};
          if(migrated.multiplicationLessonSeen)lessonSeen['multiply-2']=true;
          if(migrated.divisionLessonSeen)lessonSeen['divide-2']=true;
          migrated={...migrated,lessonSeen,saveVersion:2};
          version=2;
          continue;
        }
        return null;
      }
      if(version>schemaVersion)return null;
      return migrated;
    }

    function normalize(saved){
      const migrated=migrate(saved);
      if(!migrated||!Number.isInteger(migrated.unlockedLevel)||!Array.isArray(migrated.completedLevels))return defaultProgress();
      const completedLevels=[...new Set(migrated.completedLevels)]
        .filter(level=>Number.isInteger(level)&&level>=1&&level<=maxLevel)
        .sort((a,b)=>a-b);
      const lessonSeen=migrated.lessonSeen&&typeof migrated.lessonSeen==='object'?{...migrated.lessonSeen}:{};
      if(migrated.multiplicationLessonSeen)lessonSeen['multiply-2']=true;
      if(migrated.divisionLessonSeen)lessonSeen['divide-2']=true;
      return {
        ...defaultProgress(),
        ...migrated,
        saveVersion:schemaVersion,
        completedLevels,
        lessonSeen,
        unlockedLevel:Math.max(1,Math.min(maxLevel,migrated.unlockedLevel))
      };
    }

    function load(){
      try{return normalize(JSON.parse(storage.getItem(key)||'null'))}
      catch(error){return defaultProgress()}
    }

    function save(progress){
      const value={...progress,saveVersion:schemaVersion};
      storage.setItem(key,JSON.stringify(value));
      return value;
    }

    function clear(){storage.removeItem(key)}

    return {clear,defaultProgress,load,migrate,normalize,save};
  }

  return {create};
});
