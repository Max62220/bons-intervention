"""Calcule les empreintes des scripts inline et écrit la politique CSP de chaque page."""
import re, hashlib, base64, sys
BASE = ("default-src 'self'; script-src 'self' {hashes}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
        "font-src 'self'; connect-src 'self' https://api.github.com; manifest-src 'self'; worker-src 'self'; "
        "object-src 'none'; base-uri 'none'; form-action 'none'")
for p in sys.argv[1:]:
    s = open(p, encoding='utf8').read()
    scripts = re.findall(r'<script>(.*?)</script>', s, re.S)
    hashes = ' '.join("'sha256-" + base64.b64encode(hashlib.sha256(x.encode('utf8')).digest()).decode() + "'" for x in scripts)
    s = re.sub(r'(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")', lambda m: m[1] + BASE.format(hashes=hashes) + m[2], s, count=1)
    open(p, 'w', encoding='utf8').write(s)
    print(p, len(scripts), 'script(s) inline')
