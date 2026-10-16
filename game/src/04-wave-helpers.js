function getWaveProgress(){return Math.min(0.99,((S.gpus%5)*20+S.chips)/100);}
function getDifficultyTier(){return Math.max(1,Math.min(5,S.wave));}
function getArchiveHint(){const tier=getDifficultyTier();const hints=['15-24%','25-39%','40-59%','60-79%','80-100%'];return hints[tier-1];}
