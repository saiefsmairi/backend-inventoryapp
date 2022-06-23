const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("---------------")

        console.log(allowedRoles)
        console.log(req?.role.role)


        if (!req?.role.role) return res.status(401).json({ message: "request mafihech roles" });

        const rolesArray = [...allowedRoles];

        const result = req.role.role.map(role => rolesArray.includes(role)).find(val => val === true);
        console.log("--------***-------")

        if (result != true)
            return res.status(401).json({ error: 'you dont have the permission' });
        next();


    }
}

module.exports = verifyRoles


