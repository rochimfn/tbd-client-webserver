# Web monitoring custom log shipping

## Panduan Pemasangan

### Prerequisite

* [Git](https://git-scm.com/downloads)
* [NodeJs](https://nodejs.org/en/download/) versi v14 atau lebih tinggi
* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) versi 1.22
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) versi 2019 Express edition


### Mulai Pemasangan

1. Salin repositori

```bash
git clone https://github.com/rochimfn/tbd-client-webserver.git
```

2. Masuk ke direktori

```bash
cd tbd-client-webserver
```

3. Pasang dependensi

```bash
yarn 
```

4. Konfigurasi `.env`

```bash
cp .env.example .env #bash atau powershell
copy .env.example .env #cmd
```

Isi konfigurasi dengan kredensial sqlserver. Contohnya sebagai berikut:

**Pastikan SQL Server dan aplikasi ini memiliki akses baca tulis direktori `DIR_BACKUP`**
```env
PASSWORD='password'
TOKEN='qwertyuiopasdfghjklzxcvbnm123456'
MSSQL_HOST='127.0.0.1'
MSSQL_PORT=1432
MSSQL_USERNAME='admin'
MSSQL_PASSWORD='password'
DIR_BACKUP='C:\rc_backup_client\'
```

5. Menyiapkan akun pengguna

```
yarn setup
```

Pengguna default:
  * Email: `rochim.noviyan@gmail.com`
  * Password: `password` (atau menyesuaikan nilai konfigurasi `PASSWORD` pada `.env`)


6. Jalankan web server


```
yarn start
```

Tunggu sebentar dan web client dapat diakses melalui port 3000.

Server dapat dimatikan dengan menekan tombol `CTRL+C`

7. Jalankan web server sebagai daemon


```
yarn global add pm2
pm2 start src/index.js --name "rc-client"
```

Gunakan perintah berikut untuk menghentikan daemon

```
pm2 stop "rc-client"
```


### Restore Script

Restore script dapat ditemukan pada `scripts/restore.js`. 
Script dapat dijalankan dengan perintah berikut:

```
node scripts/restore.js
```
