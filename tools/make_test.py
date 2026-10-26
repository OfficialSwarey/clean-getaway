"""Build tests/test.html from index.html: local three.js and a hook (window.__qh) the test scripts use."""
import os,re,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s=open(os.path.join(R,'index.html')).read()
s=s.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','node_modules/three/build/three.min.js')
s=s.replace('<title>Clean Getaway</title>','<title>Clean Getaway</title><script>try{localStorage.setItem("cg-mode","free")}catch(e){}window.__qhMove="classic";window.__qhStartScreen=new URLSearchParams(location.search).get("screen")||"solo";</script>',1)
hook=open(os.path.join(R,'tools','test_hook.js')).read().strip()+'\n'
i=s.rindex('buildMap(selectedMap);')
s=s[:i]+hook+s[i:]
out=sys.argv[1] if len(sys.argv)>1 else 'test.html'   # another name lets a new build be tried while a suite runs on test.html
open(os.path.join(R,'tests',out),'w').write(s)
print('tests/'+out+' built')
