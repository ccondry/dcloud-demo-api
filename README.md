
# Generate your RSA key pair in linux/MacOS
```bash
mkdir certs
openssl genpkey -out certs/rsa-private.pem -algorithm rsa -pkeyopt rsa_keygen_bits:2048  
openssl rsa -in certs/rsa-private.pem -out certs/rsa-public.pem -pubout  
```
