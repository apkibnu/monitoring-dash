// module express
const express = require('express');
const app = express();
const port = 3333;
const http = require('http').Server(app)
const io = require("socket.io")(http)
// mysql
const mysql = require('mysql');
// module ejs
app.set('view engine','ejs');
// access file static
app.use(express.static('public'));

let conLocal;
let conTicket;

function handleError() {
    conLocal = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "smartsys_Monitoring_mach",
        multipleStatements: true
    });

    // Connection error, 2 seconds retry
    conLocal.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
            console.log('Connected')
        }
    });

    conLocal.on('error', function (err) {
        console.log('db error', err);
        // If the connection is disconnected, automatically reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });

    conTicket = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "smartsys_Ticketing"
    });

    // Connection error, 2 seconds retry
    conTicket.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
            console.log('Connected')
        }
    });

    conTicket.on('error', function (err) {
        console.log('db error', err);
        // If the connection is disconnected, automatically reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();

io.on('connection', (socket) => {
    let c4;
    let detail;
    let detailng;
    socket.on('interval-c4', (cl) => {
        c4 = setInterval(function(){
            conLocal.query(`SELECT sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, sum(tb_produksi.target) AS target FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER ${cl}' ORDER BY tb_line.id asc`, (err, reshead) => {
                if (err) {console.log(err);}
                conLocal.query(`select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly JOIN tb_line ON tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.LINE = tb_line.NAMA_LINE WHERE tb_line.MACHINING = 'CLUSTER ${cl}' AND tanggal = CURDATE()`, (err, resdt) => {
                    if (err) {console.log(err);}
                    let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                    socket.emit('update-header', reshead[0].target || 0, reshead[0].total || 0, reshead[0].ok || 0, reshead[0].ng || 0, headDT)
                })
            })

            conLocal.query(`SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, avg(tb_produksi.ava) AS ava, avg(tb_produksi.per) AS per, avg(tb_produksi.qua) AS qua, avg(tb_produksi.oee) AS oee FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER ${cl}' GROUP BY tb_line.id ORDER BY tb_line.id asc`, (err, resperc) => {
                if (err) {console.log(err);}
                conTicket.query(`select * from tb_line where machining = 'CLUSTER ${cl}' order by id asc`, (err, resstatus) => {
                    if (err) {console.log(err);}
                    for (let i = 1; i <= resperc.length; i++) {
                        conLocal.query(`select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate() order by id asc`, [resperc[i-1].nama_part, resperc[i-1].nama_line], (err, resdt) => {
                            if (err) {console.log(err);}
                            conLocal.query(`select JAM, OK, NG, TARGET, TIME_TO_SEC(DT_AUTO) AS DT_AUTO, TIME_TO_SEC(DT_MATERIAL) AS DT_MATERIAL, TIME_TO_SEC(DT_MESIN) AS DT_MESIN, TIME_TO_SEC(DT_OTHERS) AS DT_OTHERS, TIME_TO_SEC(DT_PROSES) AS DT_PROSES, TIME_TO_SEC(DT_TERPLANNING) AS DT_TERPLANNING from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate() order by id asc`, [resperc[i-1].nama_part, resperc[i-1].nama_line], (err, res95) => {
                                if(err) {handleError();}
                                const arrLable= [];
                                const arrOK = [];
                                const arrNG = [];
                                const arrDT = [];
                                const arrTarget = [];
                                let ava = (resperc[i-1].ava * 100).toFixed(1) || 0 
                                let per = (resperc[i-1].per * 100).toFixed(1) || 0
                                let qua = (resperc[i-1].qua * 100).toFixed(1) || 0
                                let oee = (resperc[i-1].oee * 100).toFixed(1) || 0
                                for (let j = 0; j < res95.length; j++) {
                                    let dt = Math.floor((res95[j].DT_AUTO + res95[j].DT_MATERIAL + res95[j].DT_MESIN + res95[j].DT_OTHERS + res95[j].DT_PROSES + res95[j].DT_TERPLANNING)/resperc[i-1].cycle_time)
                                    arrLable.push(res95[j].JAM || 0)
                                    arrOK.push(res95[j].OK || 0)
                                    arrNG.push(res95[j].NG || 0)
                                    arrDT.push(dt || 0)
                                    arrTarget.push(res95[j].TARGET || 0)
                                }
                                let progok = (resperc[i-1].ok/resperc[i-1].total*100 || 0).toFixed(1)
                                let progng = (resperc[i-1].ng/resperc[i-1].total*100 || 0).toFixed(1)
                                let progdt = ((resdt[0].dthourly/resperc[i-1].cycle_time)/resperc[i-1].total*100 || 0).toFixed(1) 
                                socket.emit('update-chart', arrLable, arrOK, arrNG, arrDT, arrTarget, i);
                                socket.emit('update-oee', ava, per, qua, oee, i)
                                socket.emit('update-backcard', progok, progng, progdt, i)
                                socket.emit('update-status', i, resstatus[i-1].STATUS)
                            })
                        })
                    }
                })
            })
        }, 2000)
    })
    socket.on('interval-detail', (part, line) => {
        detail = setInterval(function(){  
            conLocal.query("select JAM, OK, NG, TOTAL_PRODUKSI, TARGET, (time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate() order by id asc", [part, line], (err, res95) => {
                conLocal.query("SELECT * FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.nama_part = ? and tb_line.nama_line = ?", [part, line], (err, resperc) => {
                    conLocal.query("SELECT SUM(TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto, sum(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat, sum(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,sum(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth  FROM tb_dt_terplanning  JOIN tb_dt_auto ON tb_dt_terplanning.ID = tb_dt_auto.ID  join tb_dt_proses ON tb_dt_auto.ID = tb_dt_proses.ID join tb_dt_material ON tb_dt_proses.ID = tb_dt_material.ID join tb_dt_mesin ON tb_dt_material.ID = tb_dt_mesin.ID  join tb_dt_others ON tb_dt_mesin.ID = tb_dt_others.ID  WHERE tb_dt_terplanning.NAMA_PART = ? AND tb_dt_terplanning.LINE = ? AND tb_dt_terplanning.TANGGAL = CURDATE() GROUP BY tb_dt_terplanning.NAMA_PART;", [part, line], (err, resdt) => {
                        conLocal.query("SELECT SUM(DIMENSI) as dm, SUM(BLONG) as bl, SUM(SERET) as sr, SUM(DENT) as dn, SUM(UNCUTTING) as uc, SUM(STEP) as st, SUM(KASAR) as ks, SUM(NG_ASSY) as na, SUM(RIVET) as rv, SUM(BIMETAL) as bm, SUM(JOINT_TUBE) as jt, SUM(PLATE) as pl, SUM(NO_JIG) as nj, SUM(OTHERS_P) as op, SUM(KEROPOS) as kr, SUM(BOCOR) as bc, SUM(FLOWLINE) as fl, SUM(RETAK) as rt, SUM(GOMPAL) as gp, SUM(OVER_PROSES) as ov, SUM(KURANG_PROSES) as kp, SUM(JAMUR) as jm, SUM(UNDERCUT) as un, SUM(DEKOK) as dk, SUM(TRIAL) as tr, SUM(UNCUT_MATERIAL) as um, SUM(OTHERS_MATERIAL) as om from tb_rejection where nama_part = ? and line = ? and tanggal = CURDATE();", [part, line], (err, resng) => {
                            conLocal.query("SELECT sum(ok) as ok, SUM(total_produksi) as total, SUM(ng) as ng, SUM(target) as target FROM tb_produksi WHERE nama_part = ? and line = ? AND tanggal = CURDATE()", [part, line], (err, reshead) => {
                                if (res95.length == 0) {
                                    return
                                } else {
                                    let totalDT = resdt[0].totalmat + resdt[0].totalpro + resdt[0].totalmesin + resdt[0].totalauto + resdt[0].totaloth +resdt[0].totalplan
                                    let headDT = `${Math.floor(totalDT/60)}m:${totalDT % 60}s`
                                    const detailNG = [resng[0].dm, resng[0].bl, resng[0].sr, resng[0].dn, resng[0].uc, resng[0].st, resng[0].ks, resng[0].na, resng[0].rv, resng[0].bm, resng[0].jt, resng[0].pl, resng[0].nj, resng[0].op, resng[0].kr, resng[0].bc, resng[0].fl, resng[0].rt, resng[0].gp, resng[0].ov, resng[0].kp, resng[0].jm, resng[0].un, resng[0].dk, resng[0].tr, resng[0].um, resng[0].om]
                                    const lableNG = ['DIMENSI', 'BLONG', 'SERET', 'DENT', 'UNCUTTING', 'STEP', 'KASAR', 'NG_ASSY', 'RIVET', 'BIMETAL', 'JOINT_TUBE', 'PLATE', 'NO_JIG', 'OTHERS_P', 'KEROPOS', 'BOCOR', 'FLOWLINE', 'RETAK', 'GOMPAL', 'OVER_PROSES', 'KURANG_PROSES', 'JAMUR', 'UNDERCUT', 'DEKOK', 'TRIAL', 'UNCUT_MATERIAL', 'OTHERS_MATERIAL']
                                    const arrLable= [];
                                    const arrValTotal = [];
                                    const arrValOK = [];
                                    const arrValNG = [];
                                    const arrValDT = [];
                                    const valDT = [Math.floor(resdt[0].totalmat/60), Math.floor(resdt[0].totalpro/60), Math.floor(resdt[0].totalmesin/60), Math.floor(resdt[0].totalauto/60), Math.floor(resdt[0].totaloth/60), Math.floor(resdt[0].totalplan/60)]
                                    for (let i = 0; i < res95.length; i++) {
                                        arrLable.push(res95[i].JAM)
                                        arrValTotal.push(res95[i].TOTAL_PRODUKSI)
                                        arrValOK.push((res95[i].OK/res95[i].TARGET*100).toFixed(2) || 0)
                                        arrValNG.push((res95[i].NG/res95[i].TARGET*100).toFixed(2) || 0)
                                        arrValDT.push((Math.floor(res95[i].dthourly/resperc[0].CYCLE_TIME)/res95[i].TARGET*100).toFixed(2) || 0)
                                    }
                                    socket.emit('update-chart-perc', arrLable, arrValOK, arrValNG, arrValDT)
                                    socket.emit('update-chart-ng', detailNG, lableNG)
                                    socket.emit('update-chart-dt', valDT)
                                    socket.emit('update-header', reshead[0].total, reshead[0].ng, reshead[0].ok, headDT, reshead[0].target)
                                }
                            })
                        })
                    })
                })
            })
        }, 2000);
    })
    socket.on('interval-detail-ng', (part, line) => {
        detailng = setInterval(() => {
            conLocal.query("SELECT sum(ok) as ok, SUM(total_produksi) as total, SUM(ng) as ng, SUM(target) as target FROM tb_produksi WHERE nama_part = ? and line = ? AND tanggal = CURDATE()", [part, line], (err, reshead) => {
                conLocal.query("SELECT sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly WHERE nama_part = ? AND line = ? AND tanggal = CURDATE()", [part, line], (err, resdt) => {
                    let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                    socket.emit('update-header', reshead[0].total, reshead[0].ng, reshead[0].ok, headDT, reshead[0].target)
                })
            })
            conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_3 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_3' AND (COLUMN_NAME LIKE 'GP_' OR COLUMN_NAME LIKE 'OV_' OR COLUMN_NAME LIKE 'KP_' OR COLUMN_NAME LIKE 'JM_' OR COLUMN_NAME LIKE 'UN_' OR COLUMN_NAME LIKE 'DK_' OR COLUMN_NAME LIKE 'TR_' OR COLUMN_NAME LIKE 'UM_' OR COLUMN_NAME LIKE 'OM_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [part, line], (err, resloc3) => {
                conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_2 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_2' AND (COLUMN_NAME LIKE 'BM_' OR COLUMN_NAME LIKE 'JT_' OR COLUMN_NAME LIKE 'PL_' OR COLUMN_NAME LIKE 'NJ_' OR COLUMN_NAME LIKE 'OP_' OR COLUMN_NAME LIKE 'BC_' OR COLUMN_NAME LIKE 'FL_' OR COLUMN_NAME LIKE 'RT_' OR COLUMN_NAME LIKE 'KR_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [part, line], (err, resloc2) =>{
                    conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_1 WHERE nama_part = ? and line = ? and tanggal = curdate()")  FROM  INFORMATION_SCHEMA.COLUMNS  WHERE TABLE_SCHEMA = (select DATABASE())  AND TABLE_NAME= 'tb_locsheet_1'  AND (COLUMN_NAME LIKE 'DM_'  OR COLUMN_NAME LIKE 'BL_'  OR COLUMN_NAME LIKE 'SR_'  OR COLUMN_NAME LIKE 'DN_'  OR COLUMN_NAME LIKE 'UC_'  OR COLUMN_NAME LIKE 'ST_'  OR COLUMN_NAME LIKE 'KS_'  OR COLUMN_NAME LIKE 'NA_'  OR COLUMN_NAME LIKE 'RV_') INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [part, line], (err, resloc1) =>{
                        const [dm, bl, sr, dn, uc, st, ks, na, rv] = Array.from({ length: 9 }, () => []);
                        const [bm, jt, pl, nj, op, bc, fl, rt, kr] = Array.from({ length: 9 }, () => []);
                        const [gp, ov, kp, jm ,un, dk, tr, um, om] = Array.from({ length: 9 }, () => []);
                        for (let i=1; i<=24; i++){
                            var letter = String.fromCharCode(i + 64);
                            dm.push(resloc1[2][0][`COALESCE(SUM(DM${letter}),0)`])
                            bl.push(resloc1[2][0][`COALESCE(SUM(BL${letter}),0)`])
                            sr.push(resloc1[2][0][`COALESCE(SUM(SR${letter}),0)`])
                            dn.push(resloc1[2][0][`COALESCE(SUM(DN${letter}),0)`])
                            uc.push(resloc1[2][0][`COALESCE(SUM(UC${letter}),0)`])
                            st.push(resloc1[2][0][`COALESCE(SUM(ST${letter}),0)`])
                            ks.push(resloc1[2][0][`COALESCE(SUM(KS${letter}),0)`])
                            na.push(resloc1[2][0][`COALESCE(SUM(NA${letter}),0)`])
                            rv.push(resloc1[2][0][`COALESCE(SUM(RV${letter}),0)`])
                            bm.push(resloc2[2][0][`COALESCE(SUM(BM${letter}),0)`]) 
                            jt.push(resloc2[2][0][`COALESCE(SUM(JT${letter}),0)`])
                            pl.push(resloc2[2][0][`COALESCE(SUM(PL${letter}),0)`])
                            nj.push(resloc2[2][0][`COALESCE(SUM(NJ${letter}),0)`])
                            op.push(resloc2[2][0][`COALESCE(SUM(OP${letter}),0)`])
                            bc.push(resloc2[2][0][`COALESCE(SUM(BC${letter}),0)`])
                            fl.push(resloc2[2][0][`COALESCE(SUM(FL${letter}),0)`]) 
                            rt.push(resloc2[2][0][`COALESCE(SUM(RT${letter}),0)`]) 
                            kr.push(resloc2[2][0][`COALESCE(SUM(KR${letter}),0)`])
                            gp.push(resloc3[2][0][`COALESCE(SUM(GP${letter}),0)`])
                            ov.push(resloc3[2][0][`COALESCE(SUM(OV${letter}),0)`])
                            kp.push(resloc3[2][0][`COALESCE(SUM(KP${letter}),0)`])
                            jm.push(resloc3[2][0][`COALESCE(SUM(JM${letter}),0)`]) 
                            un.push(resloc3[2][0][`COALESCE(SUM(UN${letter}),0)`])
                            dk.push(resloc3[2][0][`COALESCE(SUM(DK${letter}),0)`])
                            tr.push(resloc3[2][0][`COALESCE(SUM(TR${letter}),0)`])
                            um.push(resloc3[2][0][`COALESCE(SUM(UM${letter}),0)`])
                            om.push(resloc3[2][0][`COALESCE(SUM(OM${letter}),0)`])
                        }
                        const datachart = [dm, bl, sr, dn, uc, st, ks, na, rv, bm, jt, pl, nj, op, kr, bc, fl, rt, gp, ov, kp, jm ,un, dk, tr, um, om];
                        socket.emit('update-val', datachart)
                    })
                })
            })         
        }, 2000);
    })
    socket.on('disconnect', () => {
        clearInterval(c4)
        clearInterval(detail)
        clearInterval(detailng)
    })
})

app.get('/', (req, res) => {
    conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, avg(tb_produksi.ava) AS ava, avg(tb_produksi.per) AS per, avg(tb_produksi.qua) AS qua, avg(tb_produksi.oee) AS oee FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 1' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resperc) => {
        conLocal.query("SELECT sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, sum(tb_produksi.target) AS target FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 1' ORDER BY tb_line.id asc", (err, reshead) => {
            conLocal.query("select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly JOIN tb_line ON tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.LINE = tb_line.NAMA_LINE WHERE tb_line.MACHINING = 'CLUSTER 1' AND tanggal = CURDATE()", (err, resdt) => {
                conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(time_to_sec(tb_data_hourly.DT_AUTO) + time_to_sec(tb_data_hourly.DT_MATERIAL) + time_to_sec(tb_data_hourly.DT_MESIN) + time_to_sec(tb_data_hourly.DT_OTHERS) + time_to_sec(tb_data_hourly.DT_PROSES) + time_to_sec(tb_data_hourly.DT_TERPLANNING)) AS dthourly FROM tb_line left JOIN tb_data_hourly ON tb_data_hourly.LINE = tb_line.NAMA_LINE AND tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 1' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resprogdt) => {
                    conTicket.query("select * from tb_line where machining = 'CLUSTER 1' order by id asc", (err, resstatus) => {
                        let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                        data = {
                            target: reshead[0].target || 0,
                            ok: reshead[0].ok || 0,
                            ng: reshead[0].ng || 0,
                            total: reshead[0].total || 0,
                            headDT,
                            resperc,
                            resprogdt,
                            resstatus,
                            cl: 1
                        }
                        res.render('Cluster4', data)
                    })
                })
            })
        })
    })
})

app.get('/cluster2', (req, res) => {
    conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, avg(tb_produksi.ava) AS ava, avg(tb_produksi.per) AS per, avg(tb_produksi.qua) AS qua, avg(tb_produksi.oee) AS oee FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 2' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resperc) => {
        conLocal.query("SELECT sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, sum(tb_produksi.target) AS target FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 2' ORDER BY tb_line.id asc", (err, reshead) => {
            conLocal.query("select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly JOIN tb_line ON tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.LINE = tb_line.NAMA_LINE WHERE tb_line.MACHINING = 'CLUSTER 2' AND tanggal = CURDATE()", (err, resdt) => {
                conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(time_to_sec(tb_data_hourly.DT_AUTO) + time_to_sec(tb_data_hourly.DT_MATERIAL) + time_to_sec(tb_data_hourly.DT_MESIN) + time_to_sec(tb_data_hourly.DT_OTHERS) + time_to_sec(tb_data_hourly.DT_PROSES) + time_to_sec(tb_data_hourly.DT_TERPLANNING)) AS dthourly FROM tb_line left JOIN tb_data_hourly ON tb_data_hourly.LINE = tb_line.NAMA_LINE AND tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 2' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resprogdt) => {
                    conTicket.query("select * from tb_line where machining = 'CLUSTER 2' order by id asc", (err, resstatus) => {
                        let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                        data = {
                            target: reshead[0].target || 0,
                            ok: reshead[0].ok || 0,
                            ng: reshead[0].ng || 0,
                            total: reshead[0].total || 0,
                            headDT,
                            resperc,
                            resprogdt,
                            resstatus,
                            cl: 2
                        }
                        res.render('Cluster4', data)
                    })
                })
            })
        })
    })
})

app.get('/cluster3', (req, res) => {
    conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, avg(tb_produksi.ava) AS ava, avg(tb_produksi.per) AS per, avg(tb_produksi.qua) AS qua, avg(tb_produksi.oee) AS oee FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 3' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resperc) => {
        conLocal.query("SELECT sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, sum(tb_produksi.target) AS target FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 3' ORDER BY tb_line.id asc", (err, reshead) => {
            conLocal.query("select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly JOIN tb_line ON tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.LINE = tb_line.NAMA_LINE WHERE tb_line.MACHINING = 'CLUSTER 3' AND tanggal = CURDATE()", (err, resdt) => {
                conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(time_to_sec(tb_data_hourly.DT_AUTO) + time_to_sec(tb_data_hourly.DT_MATERIAL) + time_to_sec(tb_data_hourly.DT_MESIN) + time_to_sec(tb_data_hourly.DT_OTHERS) + time_to_sec(tb_data_hourly.DT_PROSES) + time_to_sec(tb_data_hourly.DT_TERPLANNING)) AS dthourly FROM tb_line left JOIN tb_data_hourly ON tb_data_hourly.LINE = tb_line.NAMA_LINE AND tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 3' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resprogdt) => {
                    conTicket.query("select * from tb_line where machining = 'CLUSTER 3' order by id asc", (err, resstatus) => {
                        let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                        data = {
                            target: reshead[0].target || 0,
                            ok: reshead[0].ok || 0,
                            ng: reshead[0].ng || 0,
                            total: reshead[0].total || 0,
                            headDT,
                            resperc,
                            resprogdt,
                            resstatus,
                            cl: 3
                        }
                        res.render('Cluster4', data)
                    })
                })
            })
        })
    })
})

app.get('/cluster4', (req, res) => {
    conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, avg(tb_produksi.ava) AS ava, avg(tb_produksi.per) AS per, avg(tb_produksi.qua) AS qua, avg(tb_produksi.oee) AS oee FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 4' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resperc) => {
        conLocal.query("SELECT sum(tb_produksi.TOTAL_PRODUKSI) as total, sum(tb_produksi.OK) as ok, sum(tb_produksi.NG) as ng, sum(tb_produksi.target) AS target FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 4' ORDER BY tb_line.id asc", (err, reshead) => {
            conLocal.query("select sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly JOIN tb_line ON tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.LINE = tb_line.NAMA_LINE WHERE tb_line.MACHINING = 'CLUSTER 4' AND tanggal = CURDATE()", (err, resdt) => {
                conLocal.query("SELECT tb_line.nama_line as nama_line, tb_line.nama_part as nama_part, tb_line.CYCLE_TIME AS cycle_time, sum(time_to_sec(tb_data_hourly.DT_AUTO) + time_to_sec(tb_data_hourly.DT_MATERIAL) + time_to_sec(tb_data_hourly.DT_MESIN) + time_to_sec(tb_data_hourly.DT_OTHERS) + time_to_sec(tb_data_hourly.DT_PROSES) + time_to_sec(tb_data_hourly.DT_TERPLANNING)) AS dthourly FROM tb_line left JOIN tb_data_hourly ON tb_data_hourly.LINE = tb_line.NAMA_LINE AND tb_data_hourly.NAMA_PART = tb_line.NAMA_PART AND tb_data_hourly.tanggal = CURDATE() where tb_line.machining = 'CLUSTER 4' GROUP BY tb_line.id ORDER BY tb_line.id asc", (err, resprogdt) => {
                    conTicket.query("select * from tb_line where machining = 'CLUSTER 4' order by id asc", (err, resstatus) => {
                        let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                        data = {
                            target: reshead[0].target || 0,
                            ok: reshead[0].ok || 0,
                            ng: reshead[0].ng || 0,
                            total: reshead[0].total || 0,
                            headDT,
                            resperc,
                            resprogdt,
                            resstatus,
                            cl: 4
                        }
                        res.render('Cluster4', data)
                    })
                })
            })
        })
    })
})

app.get('/:line/:part', (req, res) => {
    conLocal.query("select JAM, OK, NG, TOTAL_PRODUKSI, TARGET, (time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly where nama_part = ? and line = ? and tanggal = curdate() order by id asc", [req.params.part, req.params.line], (err, res95) => {
        conLocal.query("SELECT * FROM tb_line left JOIN tb_produksi ON tb_produksi.LINE = tb_line.NAMA_LINE and tb_produksi.NAMA_PART = tb_line.NAMA_PART AND tb_produksi.tanggal = CURDATE() where tb_line.nama_part = ? and tb_line.nama_line = ?", [req.params.part, req.params.line], (err, resperc) => {
            conLocal.query("SELECT SUM(TIME_TO_SEC(`5R`) + TIME_TO_SEC(MP_PENGGANTI) + TIME_TO_SEC(CT_TIDAK_STANDART) + TIME_TO_SEC(MP_DIALIHKAN) + TIME_TO_SEC(DANDORY) + TIME_TO_SEC(PREVENTIVE_MAINT) + TIME_TO_SEC(PROD_PART_LAIN) + TIME_TO_SEC(`PRODUKSI_2/3_JIG`) + TIME_TO_SEC(`PRODUKSI_1_M/P`) + TIME_TO_SEC(`PRODUKSI_2_M/C`) + TIME_TO_SEC(OVERLAP_LINE_LAIN) + TIME_TO_SEC(LAYOFF_MANPOWER) + TIME_TO_SEC(LAYOFF_TOOL_KOSONG) + TIME_TO_SEC(LAYOFF_KOMP_SPM) + TIME_TO_SEC(LAYOFF_KOMP_CNC) + TIME_TO_SEC(PACKAGING_KOSONG) + TIME_TO_SEC(LAYOFF_STOCK_WAITING)) AS totalplan, sum(TIME_TO_SEC(gagal_vacum) + TIME_TO_SEC(gagal_ambil) + TIME_TO_SEC(instocker) + TIME_TO_SEC(outstocker) + TIME_TO_SEC(feeder) + TIME_TO_SEC(flipper) + TIME_TO_SEC(robot)) AS totalauto, sum(TIME_TO_SEC(MC_TROUBLE) + TIME_TO_SEC(MC_ASSY_TROUBLE) + TIME_TO_SEC(MC_SPM_DRILL) + TIME_TO_SEC(LT_TROUBLE) + TIME_TO_SEC(WASHING_TROUBLE) + TIME_TO_SEC(ANGIN_DROP) + TIME_TO_SEC(PENAMBAHAN_COOLANT) + TIME_TO_SEC(WARMING_UP) + TIME_TO_SEC(OTHERS_MC)) AS totalmesin, sum(TIME_TO_SEC(stock_waiting) + TIME_TO_SEC(PARTIAL) + TIME_TO_SEC(sortir) + TIME_TO_SEC(innerpart_kosong) + TIME_TO_SEC(repair_part) + TIME_TO_SEC(trimming_part) + TIME_TO_SEC(sto) + TIME_TO_SEC(others_material)) AS totalmat, sum(TIME_TO_SEC(SETTING_PROGRAM) + TIME_TO_SEC(GANTI_TOOL) + TIME_TO_SEC(TRIAL_MACHINING) + TIME_TO_SEC(Q_TIME) + TIME_TO_SEC(JIG_FIXTURE) + TIME_TO_SEC(WAITING_CMM) + TIME_TO_SEC(UKUR_MANUAL) + TIME_TO_SEC(LT_IMPRAG) + TIME_TO_SEC(GANTI_THREEBOND) + TIME_TO_SEC(PERUBAHAN_PROSES) + TIME_TO_SEC(JOB_SET_UP) + TIME_TO_SEC(TRIAL_NON_MACH) + TIME_TO_SEC(OTHERS_PROSES)) AS totalpro,sum(TIME_TO_SEC(PERSIAPAN_PROD) + TIME_TO_SEC(LISTRIK_MATI) + TIME_TO_SEC(KURAS_WASHING) + TIME_TO_SEC(P5M) + TIME_TO_SEC(MP_SAKIT) + TIME_TO_SEC(OTHERS)) AS totaloth  FROM tb_dt_terplanning  JOIN tb_dt_auto ON tb_dt_terplanning.ID = tb_dt_auto.ID  join tb_dt_proses ON tb_dt_auto.ID = tb_dt_proses.ID join tb_dt_material ON tb_dt_proses.ID = tb_dt_material.ID join tb_dt_mesin ON tb_dt_material.ID = tb_dt_mesin.ID  join tb_dt_others ON tb_dt_mesin.ID = tb_dt_others.ID  WHERE tb_dt_terplanning.NAMA_PART = ? AND tb_dt_terplanning.LINE = ? AND tb_dt_terplanning.TANGGAL = CURDATE() GROUP BY tb_dt_terplanning.NAMA_PART;", [req.params.part, req.params.line], (err, resdt) => {
                conLocal.query("SELECT SUM(DIMENSI) as dm, SUM(BLONG) as bl, SUM(SERET) as sr, SUM(DENT) as dn, SUM(UNCUTTING) as uc, SUM(STEP) as st, SUM(KASAR) as ks, SUM(NG_ASSY) as na, SUM(RIVET) as rv, SUM(BIMETAL) as bm, SUM(JOINT_TUBE) as jt, SUM(PLATE) as pl, SUM(NO_JIG) as nj, SUM(OTHERS_P) as op, SUM(KEROPOS) as kr, SUM(BOCOR) as bc, SUM(FLOWLINE) as fl, SUM(RETAK) as rt, SUM(GOMPAL) as gp, SUM(OVER_PROSES) as ov, SUM(KURANG_PROSES) as kp, SUM(JAMUR) as jm, SUM(UNDERCUT) as un, SUM(DEKOK) as dk, SUM(TRIAL) as tr, SUM(UNCUT_MATERIAL) as um, SUM(OTHERS_MATERIAL) as om from tb_rejection where nama_part = ? and line = ? and tanggal = CURDATE();", [req.params.part, req.params.line], (err, resng) => {
                    conLocal.query("SELECT sum(ok) as ok, SUM(total_produksi) as total, SUM(ng) as ng, SUM(target) as target FROM tb_produksi WHERE nama_part = ? AND line = ? AND tanggal = CURDATE()", [req.params.part, req.params.line], (err, reshead) => {
                        if (resdt.length == 0 || res95.length == 0 || resperc.length == 0 || resng.length == 0 || reshead.length == 0) {
                            const lableNG = ['DIMENSI', 'BLONG', 'SERET', 'DENT', 'UNCUTTING', 'STEP', 'KASAR', 'NG_ASSY', 'RIVET', 'BIMETAL', 'JOINT_TUBE', 'PLATE', 'NO_JIG', 'OTHERS_P', 'KEROPOS', 'BOCOR', 'FLOWLINE', 'RETAK', 'GOMPAL', 'OVER_PROSES', 'KURANG_PROSES', 'JAMUR', 'UNDERCUT', 'DEKOK', 'TRIAL', 'UNCUT_MATERIAL', 'OTHERS_MATERIAL']
                            data = {
                                lable: 0,
                                total: 0,
                                ok: 0,
                                ng: 0,
                                dt: 0,
                                valNG: 0,
                                lableNG: lableNG,
                                valDT: 0,
                                headOK: 0,
                                headTP: 0,
                                headNG: 0,
                                headDT: 0,
                                target: 0,
                                cycleTime: resperc[0].CYCLE_TIME,
                                line: req.params.line,
                                part: req.params.part
                            }
                            res.render('Detail', data)
                        } else {
                            let totalDT = resdt[0].totalmat + resdt[0].totalpro + resdt[0].totalmesin + resdt[0].totalauto + resdt[0].totaloth +resdt[0].totalplan
                            let headDT = `${Math.floor(totalDT/60)}m:${totalDT % 60}s`
                            const detailNG = [resng[0].dm, resng[0].bl, resng[0].sr, resng[0].dn, resng[0].uc, resng[0].st, resng[0].ks, resng[0].na, resng[0].rv, resng[0].bm, resng[0].jt, resng[0].pl, resng[0].nj, resng[0].op, resng[0].kr, resng[0].bc, resng[0].fl, resng[0].rt, resng[0].gp, resng[0].ov, resng[0].kp, resng[0].jm, resng[0].un, resng[0].dk, resng[0].tr, resng[0].um, resng[0].om]
                            const lableNG = ['DIMENSI', 'BLONG', 'SERET', 'DENT', 'UNCUTTING', 'STEP', 'KASAR', 'NG_ASSY', 'RIVET', 'BIMETAL', 'JOINT_TUBE', 'PLATE', 'NO_JIG', 'OTHERS_P', 'KEROPOS', 'BOCOR', 'FLOWLINE', 'RETAK', 'GOMPAL', 'OVER_PROSES', 'KURANG_PROSES', 'JAMUR', 'UNDERCUT', 'DEKOK', 'TRIAL', 'UNCUT_MATERIAL', 'OTHERS_MATERIAL']
                            const arrLable= [];
                            const arrValTotal = [];
                            const arrValOK = [];
                            const arrValNG = [];
                            const arrValDT = [];
                            const valDT = [Math.floor(resdt[0].totalmat/60), Math.floor(resdt[0].totalpro/60), Math.floor(resdt[0].totalmesin/60), Math.floor(resdt[0].totalauto/60), Math.floor(resdt[0].totaloth/60), Math.floor(resdt[0].totalplan/60)]
                            for (let i = 0; i < res95.length; i++) {
                                arrLable.push(res95[i].JAM)
                                arrValTotal.push(res95[i].TOTAL_PRODUKSI)
                                arrValOK.push((res95[i].OK/res95[i].TARGET*100).toFixed(2) || 0)
                                arrValNG.push((res95[i].NG/res95[i].TARGET*100).toFixed(2) || 0)
                                arrValDT.push((Math.floor(res95[i].dthourly/resperc[0].CYCLE_TIME)/res95[i].TARGET*100).toFixed(2) || 0)
                            }
                            data = {
                                lable: arrLable,
                                total: arrValTotal,
                                ok: arrValOK,
                                ng: arrValNG,
                                dt: arrValDT,
                                valNG: detailNG,
                                lableNG: lableNG,
                                valDT: valDT,
                                headOK: reshead[0].ok,
                                headTP: reshead[0].total,
                                headNG: reshead[0].ng,
                                headDT,
                                target: reshead[0].target,
                                cycleTime: resperc[0].CYCLE_TIME,
                                line: req.params.line,
                                part: req.params.part
                            }
                            res.render('Detail', data)
                        }
                    })
                })
            })
        })
    })
})

app.get("/:line/:part/detailreject", (req, res) => {
    conLocal.query("SELECT sum(ok) as ok, SUM(total_produksi) as total, SUM(ng) as ng, SUM(target) as target FROM tb_produksi WHERE nama_part = ? and line = ? AND tanggal = CURDATE()", [req.params.part, req.params.line], (err, reshead) => {
        conLocal.query("SELECT sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly WHERE nama_part = ? AND line = ? AND tanggal = CURDATE()", [req.params.part, req.params.line], (err, resdt) => {
            conLocal.query("select cycle_time from tb_line where nama_part = ? and nama_line = ?", [req.params.part, req.params.line], (err, resct) => {
                conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_3 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_3' AND (COLUMN_NAME LIKE 'GP_' OR COLUMN_NAME LIKE 'OV_' OR COLUMN_NAME LIKE 'KP_' OR COLUMN_NAME LIKE 'JM_' OR COLUMN_NAME LIKE 'UN_' OR COLUMN_NAME LIKE 'DK_' OR COLUMN_NAME LIKE 'TR_' OR COLUMN_NAME LIKE 'UM_' OR COLUMN_NAME LIKE 'OM_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc3) => {
                    conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_2 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_2' AND (COLUMN_NAME LIKE 'BM_' OR COLUMN_NAME LIKE 'JT_' OR COLUMN_NAME LIKE 'PL_' OR COLUMN_NAME LIKE 'NJ_' OR COLUMN_NAME LIKE 'OP_' OR COLUMN_NAME LIKE 'BC_' OR COLUMN_NAME LIKE 'FL_' OR COLUMN_NAME LIKE 'RT_' OR COLUMN_NAME LIKE 'KR_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc2) =>{
                        conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_1 WHERE nama_part = ? and line = ? and tanggal = curdate()")  FROM  INFORMATION_SCHEMA.COLUMNS  WHERE TABLE_SCHEMA = (select DATABASE())  AND TABLE_NAME= 'tb_locsheet_1'  AND (COLUMN_NAME LIKE 'DM_'  OR COLUMN_NAME LIKE 'BL_'  OR COLUMN_NAME LIKE 'SR_'  OR COLUMN_NAME LIKE 'DN_'  OR COLUMN_NAME LIKE 'UC_'  OR COLUMN_NAME LIKE 'ST_'  OR COLUMN_NAME LIKE 'KS_'  OR COLUMN_NAME LIKE 'NA_'  OR COLUMN_NAME LIKE 'RV_') INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc1) =>{
                            let headDT = `${Math.floor(resdt[0].dthourly/60)}m:${resdt[0].dthourly % 60}s`
                            const [dm, bl, sr, dn, uc, st, ks, na, rv] = Array.from({ length: 9 }, () => []);
                            const [bm, jt, pl, nj, op, bc, fl, rt, kr] = Array.from({ length: 9 }, () => []);
                            const [gp, ov, kp, jm ,un, dk, tr, um, om] = Array.from({ length: 9 }, () => []);
                            for (let i=1; i<=24; i++){
                                var letter = String.fromCharCode(i + 64);
                                dm.push(resloc1[2][0][`COALESCE(SUM(DM${letter}),0)`])
                                bl.push(resloc1[2][0][`COALESCE(SUM(BL${letter}),0)`])
                                sr.push(resloc1[2][0][`COALESCE(SUM(SR${letter}),0)`])
                                dn.push(resloc1[2][0][`COALESCE(SUM(DN${letter}),0)`])
                                uc.push(resloc1[2][0][`COALESCE(SUM(UC${letter}),0)`])
                                st.push(resloc1[2][0][`COALESCE(SUM(ST${letter}),0)`])
                                ks.push(resloc1[2][0][`COALESCE(SUM(KS${letter}),0)`])
                                na.push(resloc1[2][0][`COALESCE(SUM(NA${letter}),0)`])
                                rv.push(resloc1[2][0][`COALESCE(SUM(RV${letter}),0)`])
                                bm.push(resloc2[2][0][`COALESCE(SUM(BM${letter}),0)`]) 
                                jt.push(resloc2[2][0][`COALESCE(SUM(JT${letter}),0)`])
                                pl.push(resloc2[2][0][`COALESCE(SUM(PL${letter}),0)`])
                                nj.push(resloc2[2][0][`COALESCE(SUM(NJ${letter}),0)`])
                                op.push(resloc2[2][0][`COALESCE(SUM(OP${letter}),0)`])
                                bc.push(resloc2[2][0][`COALESCE(SUM(BC${letter}),0)`])
                                fl.push(resloc2[2][0][`COALESCE(SUM(FL${letter}),0)`]) 
                                rt.push(resloc2[2][0][`COALESCE(SUM(RT${letter}),0)`]) 
                                kr.push(resloc2[2][0][`COALESCE(SUM(KR${letter}),0)`])
                                gp.push(resloc3[2][0][`COALESCE(SUM(GP${letter}),0)`])
                                ov.push(resloc3[2][0][`COALESCE(SUM(OV${letter}),0)`])
                                kp.push(resloc3[2][0][`COALESCE(SUM(KP${letter}),0)`])
                                jm.push(resloc3[2][0][`COALESCE(SUM(JM${letter}),0)`]) 
                                un.push(resloc3[2][0][`COALESCE(SUM(UN${letter}),0)`])
                                dk.push(resloc3[2][0][`COALESCE(SUM(DK${letter}),0)`])
                                tr.push(resloc3[2][0][`COALESCE(SUM(TR${letter}),0)`])
                                um.push(resloc3[2][0][`COALESCE(SUM(UM${letter}),0)`])
                                om.push(resloc3[2][0][`COALESCE(SUM(OM${letter}),0)`])
                            }
                            data = {
                                target: reshead[0].target || 0,
                                ok: reshead[0].ok || 0,
                                ng: reshead[0].ng || 0,
                                total: reshead[0].total || 0,
                                headDT,
                                ct: resct[0].cycle_time, 
                                dm, bl, sr, dn, uc, st, ks, na, rv,
                                bm, jt, pl, nj, op, kr, bc, fl, rt, 
                                gp, ov, kp, jm ,un, dk, tr, um, om,
                                line: req.params.line,
                                part: req.params.part
                            }
                            res.render("DetailNG", data)
                        })
                    })
                })
            })
        })
    })
})

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(new Date());
});
