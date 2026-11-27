// "1 step" / "2 steps"; pass the plural when adding "s" isn't right ("lesson statuses").
export function countLabel(count,one,many=`${one}s`){return `${count} ${count===1?one:many}`;}
