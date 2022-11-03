const db = require('../config/db')
let conLocal = db.conLocal;

exports.detailLine = (req, res) => {
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
                            let totalDT = parseInt(resdt[0].totalmat) + parseInt(resdt[0].totalpro) + parseInt(resdt[0].totalmesin) + parseInt(resdt[0].totalauto) + parseInt(resdt[0].totaloth) + parseInt(resdt[0].totalplan)
                            let headDT = `${Math.floor(totalDT / 60)}m:${totalDT % 60}s`
                            console.log(totalDT)
                            const detailNG = [resng[0].dm, resng[0].bl, resng[0].sr, resng[0].dn, resng[0].uc, resng[0].st, resng[0].ks, resng[0].na, resng[0].rv, resng[0].bm, resng[0].jt, resng[0].pl, resng[0].nj, resng[0].op, resng[0].kr, resng[0].bc, resng[0].fl, resng[0].rt, resng[0].gp, resng[0].ov, resng[0].kp, resng[0].jm, resng[0].un, resng[0].dk, resng[0].tr, resng[0].um, resng[0].om]
                            const lableNG = ['DIMENSI', 'BLONG', 'SERET', 'DENT', 'UNCUTTING', 'STEP', 'KASAR', 'NG_ASSY', 'RIVET', 'BIMETAL', 'JOINT_TUBE', 'PLATE', 'NO_JIG', 'OTHERS_P', 'KEROPOS', 'BOCOR', 'FLOWLINE', 'RETAK', 'GOMPAL', 'OVER_PROSES', 'KURANG_PROSES', 'JAMUR', 'UNDERCUT', 'DEKOK', 'TRIAL', 'UNCUT_MATERIAL', 'OTHERS_MATERIAL']
                            const arrLable = [];
                            const arrValTotal = [];
                            const arrValOK = [];
                            const arrValNG = [];
                            const arrValDT = [];
                            const valDT = [Math.floor(resdt[0].totalmat / 60), Math.floor(resdt[0].totalpro / 60), Math.floor(resdt[0].totalmesin / 60), Math.floor(resdt[0].totalauto / 60), Math.floor(resdt[0].totaloth / 60), Math.floor(resdt[0].totalplan / 60)]
                            for (let i = 0; i < res95.length; i++) {
                                arrLable.push(res95[i].JAM)
                                arrValTotal.push(res95[i].TOTAL_PRODUKSI)
                                arrValOK.push((res95[i].OK / res95[i].TARGET * 100).toFixed(2) || 0)
                                arrValNG.push((res95[i].NG / res95[i].TARGET * 100).toFixed(2) || 0)
                                arrValDT.push((Math.floor(res95[i].dthourly / resperc[0].CYCLE_TIME) / res95[i].TARGET * 100).toFixed(2) || 0)
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
}

exports.detailNG = (req, res) => {
    conLocal.query("SELECT sum(ok) as ok, SUM(total_produksi) as total, SUM(ng) as ng, SUM(target) as target FROM tb_produksi WHERE nama_part = ? and line = ? AND tanggal = CURDATE()", [req.params.part, req.params.line], (err, reshead) => {
        conLocal.query("SELECT sum(time_to_sec(DT_AUTO) + time_to_sec(DT_MATERIAL) + time_to_sec(DT_MESIN) + time_to_sec(DT_OTHERS) + time_to_sec(DT_PROSES) + time_to_sec(DT_TERPLANNING)) AS dthourly from tb_data_hourly WHERE nama_part = ? AND line = ? AND tanggal = CURDATE()", [req.params.part, req.params.line], (err, resdt) => {
            conLocal.query("select cycle_time from tb_line where nama_part = ? and nama_line = ?", [req.params.part, req.params.line], (err, resct) => {
                conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_3 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_3' AND (COLUMN_NAME LIKE 'GP_' OR COLUMN_NAME LIKE 'OV_' OR COLUMN_NAME LIKE 'KP_' OR COLUMN_NAME LIKE 'JM_' OR COLUMN_NAME LIKE 'UN_' OR COLUMN_NAME LIKE 'DK_' OR COLUMN_NAME LIKE 'TR_' OR COLUMN_NAME LIKE 'UM_' OR COLUMN_NAME LIKE 'OM_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc3) => {
                    conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_2 WHERE nama_part = ? and line = ? and tanggal = curdate()") FROM  INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = (select database()) AND   TABLE_NAME   = 'tb_locsheet_2' AND (COLUMN_NAME LIKE 'BM_' OR COLUMN_NAME LIKE 'JT_' OR COLUMN_NAME LIKE 'PL_' OR COLUMN_NAME LIKE 'NJ_' OR COLUMN_NAME LIKE 'OP_' OR COLUMN_NAME LIKE 'BC_' OR COLUMN_NAME LIKE 'FL_' OR COLUMN_NAME LIKE 'RT_' OR COLUMN_NAME LIKE 'KR_')INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc2) => {
                        conLocal.query(`SELECT CONCAT('SELECT COALESCE(SUM(', group_concat(COLUMN_NAME SEPARATOR '),0), COALESCE(SUM('), "),0) FROM tb_locsheet_1 WHERE nama_part = ? and line = ? and tanggal = curdate()")  FROM  INFORMATION_SCHEMA.COLUMNS  WHERE TABLE_SCHEMA = (select DATABASE())  AND TABLE_NAME= 'tb_locsheet_1'  AND (COLUMN_NAME LIKE 'DM_'  OR COLUMN_NAME LIKE 'BL_'  OR COLUMN_NAME LIKE 'SR_'  OR COLUMN_NAME LIKE 'DN_'  OR COLUMN_NAME LIKE 'UC_'  OR COLUMN_NAME LIKE 'ST_'  OR COLUMN_NAME LIKE 'KS_'  OR COLUMN_NAME LIKE 'NA_'  OR COLUMN_NAME LIKE 'RV_') INTO @statement_var;PREPARE stmt_name FROM @statement_var;EXECUTE stmt_name;DEALLOCATE PREPARE stmt_name;`, [req.params.part, req.params.line], (err, resloc1) => {
                            let headDT = `${Math.floor(resdt[0].dthourly / 60)}m:${resdt[0].dthourly % 60}s`
                            const [dm, bl, sr, dn, uc, st, ks, na, rv] = Array.from({ length: 9 }, () => []);
                            const [bm, jt, pl, nj, op, bc, fl, rt, kr] = Array.from({ length: 9 }, () => []);
                            const [gp, ov, kp, jm, un, dk, tr, um, om] = Array.from({ length: 9 }, () => []);
                            for (let i = 1; i <= 24; i++) {
                                var letter = String.fromCharCode(i + 64);
                                dm.push(parseInt(resloc1[2][0][`COALESCE(SUM(DM${letter}),0)`]))
                                bl.push(parseInt(resloc1[2][0][`COALESCE(SUM(BL${letter}),0)`]))
                                sr.push(parseInt(resloc1[2][0][`COALESCE(SUM(SR${letter}),0)`]))
                                dn.push(parseInt(resloc1[2][0][`COALESCE(SUM(DN${letter}),0)`]))
                                uc.push(parseInt(resloc1[2][0][`COALESCE(SUM(UC${letter}),0)`]))
                                st.push(parseInt(resloc1[2][0][`COALESCE(SUM(ST${letter}),0)`]))
                                ks.push(parseInt(resloc1[2][0][`COALESCE(SUM(KS${letter}),0)`]))
                                na.push(parseInt(resloc1[2][0][`COALESCE(SUM(NA${letter}),0)`]))
                                rv.push(parseInt(resloc1[2][0][`COALESCE(SUM(RV${letter}),0)`]))
                                bm.push(parseInt(resloc2[2][0][`COALESCE(SUM(BM${letter}),0)`]))
                                jt.push(parseInt(resloc2[2][0][`COALESCE(SUM(JT${letter}),0)`]))
                                pl.push(parseInt(resloc2[2][0][`COALESCE(SUM(PL${letter}),0)`]))
                                nj.push(parseInt(resloc2[2][0][`COALESCE(SUM(NJ${letter}),0)`]))
                                op.push(parseInt(resloc2[2][0][`COALESCE(SUM(OP${letter}),0)`]))
                                bc.push(parseInt(resloc2[2][0][`COALESCE(SUM(BC${letter}),0)`]))
                                fl.push(parseInt(resloc2[2][0][`COALESCE(SUM(FL${letter}),0)`]))
                                rt.push(parseInt(resloc2[2][0][`COALESCE(SUM(RT${letter}),0)`]))
                                kr.push(parseInt(resloc2[2][0][`COALESCE(SUM(KR${letter}),0)`]))
                                gp.push(parseInt(resloc3[2][0][`COALESCE(SUM(GP${letter}),0)`]))
                                ov.push(parseInt(resloc3[2][0][`COALESCE(SUM(OV${letter}),0)`]))
                                kp.push(parseInt(resloc3[2][0][`COALESCE(SUM(KP${letter}),0)`]))
                                jm.push(parseInt(resloc3[2][0][`COALESCE(SUM(JM${letter}),0)`]))
                                un.push(parseInt(resloc3[2][0][`COALESCE(SUM(UN${letter}),0)`]))
                                dk.push(parseInt(resloc3[2][0][`COALESCE(SUM(DK${letter}),0)`]))
                                tr.push(parseInt(resloc3[2][0][`COALESCE(SUM(TR${letter}),0)`]))
                                um.push(parseInt(resloc3[2][0][`COALESCE(SUM(UM${letter}),0)`]))
                                om.push(parseInt(resloc3[2][0][`COALESCE(SUM(OM${letter}),0)`]))
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
                                gp, ov, kp, jm, un, dk, tr, um, om,
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
}