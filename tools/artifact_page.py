"""Write the claude.ai artifact version of the game (the page without the document wrapper or the home-screen tags)."""
import os,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s=open(os.path.join(R,'index.html')).read()
a=s.index('<title>');s=s[a:]
s=s.replace('</head>\n<body>\n','',1)
s=s.rstrip()
for tail in ['</html>','</body>']:
    if s.endswith(tail):s=s[:-len(tail)].rstrip()
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(R,'build','artifact.html')
os.makedirs(os.path.dirname(out),exist_ok=True);open(out,'w').write(s+'\n')
print('artifact page written to',out)
