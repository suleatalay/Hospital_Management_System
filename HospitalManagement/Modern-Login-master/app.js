const mysql = require("mysql");
    const express = require("express");
    const bodyParser = require("body-parser");
    const path=require('path');

    const app = express();


    const enCoder = bodyParser.urlencoded({ extended: true });

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "12345678",   
        database: "hosmanagement"
    });

    connection.connect(function(error) {
        if(error) {
            throw error;
        } else {
            console.log("Bağlantı başarıyla kuruldu!");
        }
    });


    app.get("/giris", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });
    app.get("/adminPanel", function(req, res) {
      res.sendFile(__dirname + "/doktor.html");
  });
  app.get("/doktorPanel", function(req, res) {
    res.sendFile(__dirname + "/admin.html");
});
  

    app.post("/submit_login_admin", enCoder, function(req, res) {
      var email = req.body.ad;
      var password = req.body.sifre;
      connection.query("SELECT * FROM yonetici WHERE adi = ? AND pass = ?", [email, password], function(error, results, fields) {
          if(error) {
              throw error;
          }
          if(results.length > 0) {
              var uye_id = results[0].uye_id;
         
           
              res.sendFile(__dirname + "/admin.html");
             
          } else {
              res.send("Giriş başarısız! E-posta veya şifre yanlış.");
          }
      });
  });


  app.post("/submit_login_doctor", enCoder, function(req, res) {
    var email = req.body.isim;
    var password = req.body.password;
    connection.query("SELECT * FROM doktorlar WHERE Ad = ? AND pass = ?", [email, password], function(error, results, fields) {
        if(error) {
            throw error;
        }
        if(results.length > 0) {
            var uye_id = results[0].uye_id;
       
         
            res.sendFile(__dirname + "/doktor.html");
           
        } else {
            res.send("Giriş başarısız! E-posta veya şifre yanlış.");
        }
    });
});

app.get("/goster", function(req, res) {
  connection.query('SELECT HastaID, Ad, Soyad, DogumTarihi, Cinsiyet, Telefon, Adres FROM hastalar', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
  });
});

app.post("/sil", enCoder, function(req, res) {
  var id = parseInt(req.body.idname);

  console.log("Alınan ID:", id); // Alınan ID'yi kontrol et
  console.log(req.body);

  
  // Veritabanında ID'nin varlığını kontrol et
  connection.query("SELECT * FROM hastalar WHERE HastaID = ?", [id], function(error, results, fields) {
      if(error) {
          res.json({ success: false, message: "Silme işlemi sırasında bir hata oluştu." });
      } else {
          if(results.length > 0) {
              // ID mevcut ise silme işlemini gerçekleştir
              connection.query("DELETE FROM hastalar WHERE HastaID = ?", [id], function(error, results, fields) {
                  if(error) {
                      res.json({ success: false, message: "Silme işlemi sırasında bir hata oluştu." });
                  } else {
                      res.json({ success: true, message: "Hasta başarıyla silindi." });
                  }
              });
          } else {
              // ID mevcut değilse hata mesajı döndür
              res.json({ success: false, message: "Belirtilen ID numarasına sahip hasta bulunamadı." });
          }
      }
  });
});

app.post("/silDoktor", enCoder, function(req, res) {
    var id = parseInt(req.body.iddname);
  
    console.log("Alınan ID:", id); // Alınan ID'yi kontrol et
    console.log(req.body);
  
    
    // Veritabanında ID'nin varlığını kontrol et
    connection.query("SELECT * FROM doktorlar WHERE DoktorID = ?", [id], function(error, results, fields) {
        if(error) {
            res.json({ success: false, message: "Silme işlemi sırasında bir hata oluştu." });
        } else {
            if(results.length > 0) {
                // ID mevcut ise silme işlemini gerçekleştir
                connection.query("DELETE FROM doktorlar WHERE DoktorID = ?", [id], function(error, results, fields) {
                    if(error) {
                        res.json({ success: false, message: "Silme işlemi sırasında bir hata oluştu." });
                    } else {
                        res.json({ success: true, message: "Doktor başarıyla silindi." });
                    }
                });
            } else {
                // ID mevcut değilse hata mesajı döndür
                res.json({ success: false, message: "Belirtilen ID numarasına sahip Doktor bulunamadı." });
            }
        }
    });
  });


app.get("/gosterAdmin", function(req, res) {
  connection.query('SELECT DoktorID, Ad, Soyad, UzmanlikAlani, CalistigiHastane FROM doktorlar', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
  });
});


app.post("/ekle", enCoder, function(req, res) {
    var uye_adi = req.body.idname;
    var uye_soyadi = req.body.idlname;
    var uye_dog = req.body.iddate;
    var uye_cins = req.body.idgender;
    var uye_tel= req.body.idtel;
    var uye_adres = req.body.idadress;

    connection.query("INSERT INTO hastalar (Ad, Soyad, DogumTarihi,Cinsiyet,Telefon,Adres) VALUES (?, ?, ?, ?, ?, ?)", [uye_adi, uye_soyadi, uye_dog, uye_cins, uye_tel, uye_adres], function(error, results, fields) {
        if(error) {
            throw error;
        }
        res.sendFile(__dirname + "/admin.html");
    });
});

app.post("/ekleDoktor", enCoder, function(req, res) {
    var uye_adi = req.body.iddname;
    var uye_soyadi = req.body.iddlname;
    var uye_uzman = req.body.iduzman;
    var uye_has= req.body.idhastane;
    var uye_sifre=req.body.idsifre;


    connection.query("INSERT INTO doktorlar (Ad, Soyad, UzmanlikAlani,CalistigiHastane,pass) VALUES (?, ?, ?, ?, ?)", [uye_adi, uye_soyadi, uye_has, uye_uzman,uye_sifre], function(error, results, fields) {
        if(error) {
            throw error;
        }
        res.sendFile(__dirname + "/admin.html");
    });
});
    
    

    app.listen(5508);