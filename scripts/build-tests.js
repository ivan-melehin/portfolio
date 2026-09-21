const fs=require("fs");
const path=require("path");
const {marked}=require("marked");

const dir=path.join(__dirname,"..","test-tasks");

const favicon="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23171717'/><text x='50' y='68' text-anchor='middle' font-family='Arial' font-size='42' font-weight='900' fill='%23f5f3ee'>IM</text></svg>";

const css=`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');

:root{
  --bg:#f5f3ee;
  --text:#171717;
  --muted:#777;
  --line:#d8d5ce;
  --accent:#e85d3f;
  --card:#ebe8e1;
}

*{box-sizing:border-box}

body{
  max-width:900px;
  margin:0 auto;
  padding:40px 24px 80px;
  font-family:Arial,Helvetica,sans-serif;
  font-size:17px;
  line-height:1.65;
  color:var(--text);
  background:var(--bg);
}

a{
  color:var(--text);
  text-decoration:underline;
  text-underline-offset:3px;
}

.top-links{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:20px;
  margin-bottom:60px;
}

.back,.github{
  font-family:'Montserrat',sans-serif;
  font-size:13px;
  font-weight:600;
  text-decoration:none;
}

.back:hover,.github:hover{color:var(--accent)}

h1,h2,h3,h4{
  font-family:'Space Grotesk',Arial,sans-serif;
  line-height:1.2;
}

h1{
  margin:0 0 50px;
  font-size:clamp(36px,6vw,64px);
  letter-spacing:-2px;
}

h2{
  margin:60px 0 25px;
  padding-top:25px;
  border-top:1px solid var(--line);
  font-size:30px;
}

h3{
  margin:40px 0 15px;
  font-size:22px;
}

h4{font-size:18px}

p{margin:0 0 20px}

strong{font-weight:700}

blockquote{
  margin:25px 0;
  padding:20px 25px;
  border-left:3px solid var(--accent);
  background:var(--card);
}

pre{
  margin:25px 0;
  padding:20px;
  overflow:auto;
  border-radius:8px;
  background:#1c1c1c;
  color:#f5f3ee;
  font-size:14px;
  line-height:1.5;
}

code{
  padding:2px 5px;
  border-radius:4px;
  background:var(--card);
  font-family:monospace;
  font-size:.9em;
}

pre code{
  padding:0;
  background:none;
}

ul,ol{
  margin:15px 0 25px;
  padding-left:30px;
}

li{margin:6px 0}

hr{
  margin:50px 0;
  border:0;
  border-top:1px solid var(--line);
}

table{
  width:100%;
  margin:25px 0;
  border-collapse:collapse;
}

th,td{
  padding:10px 12px;
  border:1px solid var(--line);
  text-align:left;
}

th{
  background:var(--card);
  font-family:'Montserrat',sans-serif;
  font-size:13px;
}

img{
  max-width:100%;
  height:auto;
}

@media(max-width:600px){
  body{
    padding:25px 18px 50px;
    font-size:16px;
  }

  .top-links{margin-bottom:40px}

  h1{
    margin-bottom:40px;
    letter-spacing:-1px;
  }

  h2{
    margin-top:45px;
    font-size:25px;
  }

  h3{font-size:20px}

  pre{
    padding:15px;
    font-size:13px;
  }
}
`;

function findMarkdownFiles(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    const fullPath=path.join(directory,entry.name);
    if(entry.isDirectory())return findMarkdownFiles(fullPath);
    return entry.name.endsWith(".md")?[fullPath]:[];
  });
}

findMarkdownFiles(dir).forEach(filePath=>{
  const md=fs.readFileSync(filePath,"utf8");
  const html=marked.parse(md);
  const title=path.basename(filePath,".md");
  const relativeDir=path.relative(dir,path.dirname(filePath)).replace(/\\/g,"/");
  const githubUrl=`https://github.com/ivan-melehin/portfolio/tree/main/test-tasks/${relativeDir}`;
  const output=path.join(path.dirname(filePath),"index.html");

  const page=`<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="${favicon}">
<title>${title} — Портфолио</title>
<style>${css}</style>
</head>
<body>
<div class="top-links">
<a class="back" href="../../index.html">← Назад к портфолио</a>
<a class="github" href="${githubUrl}" target="_blank" rel="noopener">GitHub ↗</a>
</div>
${html}
</body>
</html>`;

  fs.writeFileSync(output,page);
  console.log(`✓ ${filePath} → ${output}`);
});