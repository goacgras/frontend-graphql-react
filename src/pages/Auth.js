import './Auth.css';

const Auth = () => {
    return (
        <form className="auth-form">
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" />
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button">Switch to signup</button>
            </div>
        </form>
    );
};

export default Auth;
