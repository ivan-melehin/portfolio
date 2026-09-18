const fs=require("fs");
const path=require("path");
const {marked}=require("marked");

const dir=path.join(__dirname,"..","tests");

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

.back{
  display:inline-block;
  margin-bottom:60px;
  font-family:'Montserrat',sans-serif;
  font-size:13px;
  font-weight:600;
  text-decoration:none;
}

.back:hover{color:var(--accent)}

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

h4{
  font-size:18px;
}

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

  .back{margin-bottom:40px}

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

fs.readdirSync(dir)
  .filter(file=>file.endsWith(".md"))
  .forEach(file=>{
    const md=fs.readFileSync(path.join(dir,file),"utf8");
    const html=marked.parse(md);
    const title=path.basename(file,".md");

    const page=`<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Портфолио</title>
<style>${css}</style>
</head>
<body>
<a class="back" href="../index.html">← Назад к портфолио</a>
${html}
</body>
</html>`;

    const output=file.replace(/\\.md$/,".html");
    fs.writeFileSync(path.join(dir,output),page);
    console.log(\`✓ \${file} → \${output}\`);
  });