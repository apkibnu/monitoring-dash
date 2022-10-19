const db = require('../config/db')
let conLocal = db.conLocal;
let conTicket = db.conTicket;

exports.cluster1 = (req, res) => {
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
}

exports.cluster2 = (req, res) => {
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
}

exports.cluster3 = (req, res) => {
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
}

exports.cluster4 = (req, res) => {
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
}